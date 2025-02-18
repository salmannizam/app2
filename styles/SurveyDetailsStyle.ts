import { StyleSheet } from 'react-native';

const SurveyDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    width: '90%',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  zoneButton: {
    height: 45,
    width: '90%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  zoneButtonText: {
    fontSize: 14,
    color: '#777',
  },
  // Modal styles
  modal: {
    justifyContent: 'flex-end', // Ensures it is at the bottom of the screen
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  modalOptionButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 5,
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#444',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  prevButton: {
    width: '45%',
    height: 40,
    backgroundColor: '#FF6F61',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    width: '45%',
    height: 40,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SurveyDetailsStyles;
