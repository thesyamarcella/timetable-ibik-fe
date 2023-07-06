import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EventForm = ({ event, onCreate, onUpdate, onDelete, onCancel }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  useEffect(() => {
    setTitle(event.title || '');
    setStart(event.start);
    setEnd(event.end);
  }, [event]);

  const handleSubmit = e => {
    e.preventDefault();
    const updatedEvent = { ...event, title, start, end };
    if (event.id) {
      onUpdate(updatedEvent);
    } else {
      onCreate(updatedEvent);
    }
    resetForm();
  };

  const handleDelete = () => {
    onDelete(event);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setStart(null);
    setEnd(null);
    onCancel();
  };

  return (
    <div>
      <h2>{event.id ? 'Edit Event' : 'Add Event'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter event title"
        />
        <input
          type="datetime-local"
          value={start}
          onChange={e => setStart(e.target.value)}
        />
        <input
          type="datetime-local"
          value={end}
          onChange={e => setEnd(e.target.value)}
        />
        <button type="submit">{event.id ? 'Update' : 'Create'}</button>
        {event.id && (
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        )}
        <button type="button" onClick={resetForm}>
          Cancel
        </button>
      </form>
    </div>
  );
};

EventForm.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  }),
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EventForm;
