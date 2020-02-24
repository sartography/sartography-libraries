export const isSignedIn = (): boolean => {
  return !!localStorage.getItem('token');
};
