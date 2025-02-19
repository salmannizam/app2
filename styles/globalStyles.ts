import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  toast: {
    padding: 16,
    borderRadius: 8,
    width: '95%',
    alignSelf: 'center',
    position: 'absolute',
    top: 50,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toastSuccess: { backgroundColor: '#4CAF50' },
  toastError: { backgroundColor: '#FF6F61' },
  toastInfo: { backgroundColor: '#1E90FF' },
});
