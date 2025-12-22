export function createRandomUser() {
  const randomInt = Math.floor(Math.random() * 100000); 

  const username = `newUser${randomInt}`;
  const email = `newUserEmail${randomInt}@gmail.com`;
  const password = `password${randomInt}`;

  return {
    username,
    email,
    password
  };
}