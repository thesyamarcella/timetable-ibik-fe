import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

export default function CustomModal({
  title = "Title",
  isOpen,
  toggle,
  onCancel,
  cancelText,
  onSubmit,
  submitText,
  onDelete,
  deleteText,
  children
}) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleEdit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        {onDelete && (
          <Button color="danger" className="delete-button" onClick={handleDelete}>
            {deleteText || "Delete"}
          </Button>
        )}
        {onSubmit && (
          <Button color="primary" className="custom-button" onClick={handleEdit}>
            {submitText || "Edit"}
          </Button>
        )}
        {onCancel && (
          <Button color="light" className="cancel-button" onClick={onCancel}>
            {cancelText || "Cancel"}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
