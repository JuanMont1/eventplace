import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Badge, Modal, Dropdown } from 'react-bootstrap';
import { db, auth } from '../config/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove, deleteDoc, where } from 'firebase/firestore';
import '../styles/ForoEventos.css';

const ForoEventos = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [user, setUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Cargar eventos
    const eventsUnsubscribe = onSnapshot(collection(db, 'eventos'), (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Cargar posts
    const postsQuery = selectedEvent 
      ? query(collection(db, 'foroPosts'), where('eventId', '==', selectedEvent), orderBy('createdAt', 'desc'))
      : query(collection(db, 'foroPosts'), orderBy('createdAt', 'desc'));

    const postsUnsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const postsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsArray);
    });

    return () => {
      eventsUnsubscribe();
      postsUnsubscribe();
    };
  }, [selectedEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !user || !selectedEvent) return;

    const postData = {
      content: newPost,
      author: user.displayName || user.email,
      authorId: user.uid,
      createdAt: new Date(),
      likes: [],
      dislikes: [],
      destacado: false,
      eventId: selectedEvent,
      comments: []
    };

    if (editingPost) {
      await updateDoc(doc(db, 'foroPosts', editingPost.id), postData);
      setEditingPost(null);
    } else {
      await addDoc(collection(db, 'foroPosts'), postData);
    }

    setNewPost('');
  };

  const handleReaction = async (postId, reaction) => {
    if (!user) return; // Asegurarse de que el usuario esté autenticado
    const postRef = doc(db, 'foroPosts', postId);
    const post = posts.find(p => p.id === postId);
    if (post[reaction].includes(user.uid)) {
      await updateDoc(postRef, {
        [reaction]: arrayRemove(user.uid)
      });
    } else {
      // Si el usuario ya reaccionó de la otra manera, quitar esa reacción
      const oppositeReaction = reaction === 'likes' ? 'dislikes' : 'likes';
      if (post[oppositeReaction].includes(user.uid)) {
        await updateDoc(postRef, {
          [oppositeReaction]: arrayRemove(user.uid)
        });
      }
      await updateDoc(postRef, {
        [reaction]: arrayUnion(user.uid)
      });
    }
  };

  const handleDestacado = async (postId) => {
    const postRef = doc(db, 'foroPosts', postId);
    await updateDoc(postRef, {
      destacado: true
    });
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      await deleteDoc(doc(db, 'foroPosts', postId));
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost(post.content);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    const postRef = doc(db, 'foroPosts', selectedPost.id);
    await updateDoc(postRef, {
      comments: arrayUnion({
        content: newComment,
        author: user.displayName || user.email,
        createdAt: new Date()
      })
    });
    setNewComment('');
    setShowCommentModal(false);
  };

  return (
    <Container className="foro-eventos-container">
      <h1 className="foro-title">Foro de Eventos</h1>
      <Form.Select 
        value={selectedEvent} 
        onChange={(e) => setSelectedEvent(e.target.value)}
        className="event-select mb-3"
      >
        <option value="">Todos los eventos</option>
        {events.map(event => (
          <option key={event.id} value={event.id}>{event.title}</option>
        ))}
      </Form.Select>
      {user ? (
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group>
            <Form.Control
              as="textarea"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Comparte tu opinión sobre un evento..."
            />
          </Form.Group>
          <Button type="submit" className="mt-2">
            {editingPost ? 'Actualizar' : 'Publicar'}
          </Button>
          {editingPost && (
            <Button variant="secondary" className="mt-2 ml-2" onClick={() => setEditingPost(null)}>
              Cancelar
            </Button>
          )}
        </Form>
      ) : (
        <p>Inicia sesión para publicar comentarios.</p>
      )}
      {posts.map(post => (
        <Card key={post.id} className="mb-3">
          <Card.Body>
            <Card.Title>{post.author}</Card.Title>
            <Card.Text>{post.content}</Card.Text>
            <Button 
              variant={post.likes.includes(user?.uid) ? "primary" : "outline-primary"} 
              onClick={() => handleReaction(post.id, 'likes')}
              disabled={!user}
            >
              👍 {post.likes?.length || 0}
            </Button>
            <Button 
              variant={post.dislikes.includes(user?.uid) ? "danger" : "outline-danger"} 
              className="mx-2" 
              onClick={() => handleReaction(post.id, 'dislikes')}
              disabled={!user}
            >
              👎 {post.dislikes?.length || 0}
            </Button>
            <Button variant="outline-info" onClick={() => {
              setSelectedPost(post);
              setShowCommentModal(true);
            }}>
              💬 {post.comments?.length || 0}
            </Button>
            {!post.destacado && user?.uid === 'ID_DEL_ADMIN' && (
              <Button variant="outline-warning" onClick={() => handleDestacado(post.id)}>
                Destacar
              </Button>
            )}
            {post.destacado && <Badge bg="warning">Destacado</Badge>}
            {user?.uid === post.authorId && (
              <Dropdown className="float-end">
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  ⚙️
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleEditPost(post)}>Editar</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDeletePost(post.id)}>Eliminar</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Card.Body>
        </Card>
      ))}
      <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Comentarios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPost?.comments?.map((comment, index) => (
            <Card key={index} className="mb-2">
              <Card.Body>
                <Card.Title>{comment.author}</Card.Title>
                <Card.Text>{comment.content}</Card.Text>
              </Card.Body>
            </Card>
          ))}
          {user ? (
            <Form>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Añade un comentario..."
                />
              </Form.Group>
            </Form>
          ) : (
            <p>Inicia sesión para comentar.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCommentModal(false)}>
            Cerrar
          </Button>
          {user && (
            <Button variant="primary" onClick={handleAddComment}>
              Comentar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ForoEventos;

