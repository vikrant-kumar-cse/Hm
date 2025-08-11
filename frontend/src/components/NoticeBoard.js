import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);

  const BASE_URL = 'http://localhost:8080/notices';


  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await fetch(`${BASE_URL}/all`);
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      console.error('Fetch error', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !desc || !file) return alert('All fields are required');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('file', file);

    try {
      const res = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Upload failed');

      fetchNotices(); // refresh notices
      setModal(false);
      setTitle('');
      setDesc('');
      setFile(null);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      const res = await fetch(`${BASE_URL}/delete/${id}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Delete failed');

      fetchNotices(); // refresh list
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3>📢 Warden Notice Board</h3>
      <Button color="primary" className="mb-3" onClick={() => setModal(true)}>+ Add Notice</Button>

      {notices.length === 0 ? (
        <p>No notices uploaded yet.</p>
      ) : (
        <div className="list-group">
          {notices.map((notice) => (
            <div key={notice._id} className="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <h5>{notice.title}</h5>
                <p>{notice.description}</p>
                {notice.file && (
                  <a
                    href={`${BASE_URL}/file/${notice.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📎 View Attachment
                  </a>
                )}
              </div>
              <Button color="danger" onClick={() => handleDelete(notice._id)}>Delete</Button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>Upload New Notice</ModalHeader>
        <Form onSubmit={handleUpload}>
          <ModalBody>
            <FormGroup>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input
                type="textarea"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>File (PDF, JPG, PNG, etc.)</Label>
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary">Upload</Button>
            <Button color="secondary" onClick={() => setModal(false)}>Cancel</Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default NoticeBoard;
