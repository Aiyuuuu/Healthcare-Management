import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';



const FormContainer = styled.div`
  all: unset;
`;

const FormGroup = styled.div`
  all: unset;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  all: unset;
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
`;

const Input = styled.input`
  all: unset;
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #bdc3c7;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const TextArea = styled.textarea`
  all: unset;
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #bdc3c7;
  min-height: 100px;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const Button = styled(motion.button)`
  all: unset;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(Button)`
  background-color: #3498db;
  color: white;
`;

const SecondaryButton = styled(Button)`
  background-color: #ecf0f1;
  color: #2c3e50;
`;

const MedicineItem = styled.div`
  all: unset;
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const RemoveButton = styled.button`
  all: unset;
  color: #e74c3c;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0.5rem;
`;

const PrescriptionForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData);
  const [newMedicine, setNewMedicine] = useState({
    drug: '',
    intake: '',
    intakeInstruction: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicineChange = (e) => {
    const { name, value } = e.target;
    setNewMedicine(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMedicine = () => {
    if (newMedicine.drug.trim() === '') return;
    
    setFormData(prev => ({
      ...prev,
      prescriptionDetails: [...prev.prescriptionDetails, newMedicine]
    }));
    
    setNewMedicine({
      drug: '',
      intake: '',
      intakeInstruction: ''
    });
  };

  const removeMedicine = (index) => {
    setFormData(prev => ({
      ...prev,
      prescriptionDetails: prev.prescriptionDetails.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <FormContainer>
      <h2 style={{ marginTop: 0 }}>Prescription for {formData.patientName}</h2>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Date</Label>
          <Input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Prescription Duration (days)</Label>
          <Input 
            type="number" 
            name="prescriptionDuration" 
            value={formData.prescriptionDuration} 
            onChange={handleChange} 
            min="1"
            required 
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Medicines</Label>
          {formData.prescriptionDetails.map((medicine, index) => (
            <MedicineItem key={index}>
              <div style={{ flex: 1 }}>
                <div><strong>{medicine.drug}</strong></div>
                <div>{medicine.intake} times daily - {medicine.intakeInstruction}</div>
              </div>
              <RemoveButton onClick={() => removeMedicine(index)}>×</RemoveButton>
            </MedicineItem>
          ))}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ flex: 1 }}>
              <Input
                type="text"
                name="drug"
                placeholder="Medicine name"
                value={newMedicine.drug}
                onChange={handleMedicineChange}
              />
            </div>
            <div style={{ width: '100px' }}>
              <Input
                type="number"
                name="intake"
                placeholder="Times/day"
                value={newMedicine.intake}
                onChange={handleMedicineChange}
                min="1"
              />
            </div>
            <div style={{ flex: 1 }}>
              <Input
                type="text"
                name="intakeInstruction"
                placeholder="Instructions"
                value={newMedicine.intakeInstruction}
                onChange={handleMedicineChange}
              />
            </div>
            <Button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: '#2ecc71', color: 'white' }}
              onClick={addMedicine}
              type="button"
            >
              Add
            </Button>
          </div>
        </FormGroup>
        
        <FormGroup>
          <Label>Side Notes</Label>
          <TextArea 
            name="sideNote" 
            value={formData.sideNote} 
            onChange={handleChange} 
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Hospital Address</Label>
          <TextArea 
            name="hospitalAddress" 
            value={formData.hospitalAddress} 
            onChange={handleChange} 
            required 
          />
        </FormGroup>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <SecondaryButton 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
          >
            Save Prescription
          </PrimaryButton>
        </div>
      </form>
    </FormContainer>
  );
};

export default PrescriptionForm;