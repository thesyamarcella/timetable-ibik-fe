import React, { useState } from "react";
import { FormGroup, Label, Input, InputGroup, InputGroupAddon, Button } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

export default function FilterKelas({ classTypes, handleFilterClass }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const filteredClassTypes = classTypes.filter((classType) =>
    classType.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClassSelect = (selected) => {
    if (selected.length > 0) {
      setSelectedClass(selected[0].id);
      handleFilterClass(selected[0].id);
    } else {
      setSelectedClass("");
      handleFilterClass("");
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <FormGroup>
      <Label for="filterClass">Filter Kelas:</Label>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <Button disabled>
            <i className="fa fa-search" />
          </Button>
        </InputGroupAddon>
        <Typeahead
          id="filterClass"
          options={classTypes}
          labelKey="name"
          placeholder="Cari kelas..."
          onChange={handleClassSelect}
          onInputChange={handleSearchInputChange}
          selected={selectedClass ? [classTypes.find((classType) => classType.id === selectedClass)] : []}
        />
      </InputGroup>
    </FormGroup>
  );
}
