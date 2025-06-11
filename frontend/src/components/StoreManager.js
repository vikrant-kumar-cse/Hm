import React, { useState } from 'react';
import { Table, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const StoreManager = () => {
  const [stores, setStores] = useState([
    { id: 1, name: 'Sneaker Shop', url: '/store/sneaker', created: '2025-04-10', status: 'Active' },
    { id: 2, name: 'Tech Zone', url: '/store/tech', created: '2025-04-08', status: 'Inactive' },
  ]);

  const handleDelete = (id) => {
    const confirm = window.confirm("❌ Are you sure you want to delete this store?");
    if (confirm) {
      setStores(stores.filter(store => store.id !== id));
    }
  };

  return (
    <Card className="shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">🏪 Manage 3D Stores</h3>
        <Button variant="success">
          ➕ Create New Store
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Created On</th>
            <th>Status</th>
            <th>Preview</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.created}</td>
              <td>{store.status}</td>
              <td>
                <a href={store.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                  👁️ Preview
                </a>
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2">✏️ Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(store.id)}>🗑️ Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default StoreManager;
