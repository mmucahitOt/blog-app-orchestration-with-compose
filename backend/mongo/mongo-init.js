db.createUser({
  user: "root",
  pwd: "root1234",
  roles: [
    {
      role: "dbOwner",
      db: "blog-app-dev",
    },
    {
      role: "dbOwner",
      db: "blog-app-test",
    },
    {
      role: "dbOwner",
      db: "blog-app-prod",
    },
  ],
});
