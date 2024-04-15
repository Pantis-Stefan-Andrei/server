const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/user_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
  
  email: String,
  password: String,
account_type: String,
username: String,
anstudiu:Number
});

const User = mongoose.model('User', userSchema);

// Route to handle user signup
app.post('/api/signup', async (req, res) => {
  const { email, username, password, account_type, anstudii } = req.body;

  try {
    // Check if user already exists

    // Create a new user
    const newUser = new User({ email, username, password, account_type, anstudii });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Route to handle user login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    
    if (password!=user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // If passwords match, send success response with user data including account_type
    res.status(200).json({ message: 'Login successful', user: { email: user.email, name: user.username, account_type: user.account_type } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/api/email', async (req, res) => {
  const { email} = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  
   

    // If passwords match, send success response with user data including account_type
    res.status(200).json({  user: {id:user._id, email: user.email, username: user.username, account_type: user.account_type,anstudiu: user.anstudiu } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/api/schimbadate', async (req, res) => {
  const { email, password, account_type, username, anstudiu } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    user.password = password; // Assuming you want to update the password
    user.account_type = account_type; // Update account type
    user.username = username; // Update username
    user.anstudiu = anstudiu; // Update study year

    // Save the updated user data to the database
    await user.save();

    // Send success response with updated user data
    res.status(200).json({ user: { email: user.email, username: user.username, account_type: user.account_type, anstudiu: user.anstudiu } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rută pentru a obține toate produsele din baza de date
app.get('/api/users', async (req, res) => {
  try {
    // Obținerea tuturor produselor din baza de date
    const usersvar = await User.find({}, {  __v: 0 }); // Excludem _id și __v din rezultat
    res.json(usersvar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/api/users', async (req, res) => {
  const { email, password, account_type, username ,anstudiu} = req.body;

  try {
    // Verificăm dacă toate câmpurile sunt completate
    if (!email || !password || !account_type || !username ) {
      return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii' });
    }

    // Creăm un nou produs
    const newusersvar = new User({  email, password, account_type, username,anstudiu});

    // Salvăm noul produs în baza de date
    await newusersvar.save();

    res.status(201).json({ message: 'Produs adăugat cu succes' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.delete('/api/users/:id', async (req, res) => {
  const usersvarid = req.params.id;
  try {
    // Găsirea și ștergerea produsului din baza de date
    const usersvar = await User.findByIdAndDelete(usersvarid);
    if (!usersvar) {
      return res.status(404).json({ message: 'Produsul nu a fost găsit' });
    }
    res.status(200).json({ message: 'Produsul a fost șters cu succes' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




const productSchema = new mongoose.Schema({
  Nume: String,
  Cantitate: Number,
  Marime: String,
  Gen: String,
  Path: String,
  // alte câmpuri relevante
});

// Crearea modelului Product pe baza schemei definite
const Product = mongoose.model('Product', productSchema);

// Rută pentru a obține toate produsele din baza de date
app.get('/api/products', async (req, res) => {
  try {
    // Obținerea tuturor produselor din baza de date
    const products = await Product.find({}, {  __v: 0 }); // Excludem _id și __v din rezultat
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/api/products', async (req, res) => {
  const { Nume, Cantitate, Marime, Gen, Path } = req.body;

  try {
    // Verificăm dacă toate câmpurile sunt completate
    if (!Nume || !Cantitate || !Marime || !Gen || !Path ) {
      return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii' });
    }

    // Creăm un nou produs
    const newProduct = new Product({ Nume, Cantitate, Marime, Gen, Path });

    // Salvăm noul produs în baza de date
    await newProduct.save();

    res.status(201).json({ message: 'Produs adăugat cu succes' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.delete('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    // Găsirea și ștergerea produsului din baza de date
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produsul nu a fost găsit' });
    }
    res.status(200).json({ message: 'Produsul a fost șters cu succes' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const orderSchema = new mongoose.Schema({
  Nume: String,
  Cantitate: Number,
  Marime: String,
  Gen: String,
  Path: String,
  NumarPr: Number,
  Stare: String,
  
});

// Crearea modelului Product pe baza schemei definite
const orders = mongoose.model('orders', orderSchema);

// Rută pentru a obține toate produsele din baza de date
app.get('/api/orders', async (req, res) => {
  try {
    // Obținerea tuturor produselor din baza de date
    const ordersc = await orders.find({}, {  __v: 0 }); // Excludem _id și __v din rezultat
    res.json(ordersc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/api/orders', async (req, res) => {
  const {Nume, Cantitate, Marime, Gen, Path, Stare } = req.body;

  try {
    // Verificăm dacă toate câmpurile sunt completate
    if (!Nume || !Cantitate || !Marime || !Gen || !Path || !Stare) {
      return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii' });
    }

    // Creăm un nou produs
    const neworders = new orders({Nume, Cantitate, Marime, Gen, Path, Stare });

    // Salvăm noul produs în baza de date
    await neworders.save();

    res.status(201).json({ message: 'Produs adăugat cu succes' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Assuming you have imported or defined the 'orders' model properly
app.post('/api/neworders', async (req, res) => {
  const { Nume, Cantitate, Marime, Gen, Path, Stare } = req.body;

  try {
    // Verificăm dacă toate câmpurile sunt completate
    if (!Nume || !Cantitate || !Marime || !Gen || !Path) {
      return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii' });
    }

    // Obținem toate comenzile din baza de date
    const allOrders = await orders.find();

    // Creăm un obiect pentru a număra câte ordine conțin aceleași detalii
    const countMap = {};

    // Parcurgem toate comenzile și numărăm câte conțin aceleași detalii
    allOrders.forEach(order => {
      const key = [order.Nume, order.Cantitate, order.Marime, order.Gen, order.Path, order.Stare].join('|');
      countMap[key] = (countMap[key] || 0) + 1;
    });

    // Identificăm valoarea maximă a repetițiilor
    const maxCount = Math.max(...Object.values(countMap));

    // Ștergem comenzile care nu conțin toate detaliile
    const duplicates = allOrders.filter(order => {
      const key = [order.Nume, order.Cantitate, order.Marime, order.Gen, order.Path, order.Stare].join('|');
      return countMap[key] !== maxCount;
    });

    // Ștergem comenzile duplicate
    await Promise.all(duplicates.map(order => order.remove()));

    // Creăm un nou produs
    const newOrder = new orders({ Nume, Cantitate, Marime, Gen, Path, Stare });

    // Salvăm noul produs în baza de date
    await newOrder.save();

    // Returnăm răspunsul JSON
    res.status(201).json({ message: 'Produs adăugat cu succes', duplicates: duplicates.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  const ordersid = req.params.id;
  try {
    // Găsirea și ștergerea produsului din baza de date
    const deletedorders = await orders.findByIdAndDelete(ordersid);
    if (!deletedorders) {
      return res.status(404).json({ message: 'Produsul nu a fost găsit' });
    }
    res.status(200).json({ message: 'Produsul a fost șters cu succes' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.put('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { Cantitate } = req.body;

  try {

    const updatedOrder = await orders.findByIdAndUpdate(orderId, { Cantitate }, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    console.error('Eroare la actualizarea comenzii:', error);
    res.status(500).json({ error: 'Eroare la actualizarea comenzii' });
  }
});


const commentSchema = new mongoose.Schema({
  productId: String,
  content: String,
  rating: Number,
  User:String
});
const Comment = mongoose.model('Comment', commentSchema);
app.get('/api/comments/:productId', async (req, res) => {
  try {
    const comments = await Comment.find({ productId: req.params.productId });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Error fetching comments');
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const { productId, content, rating ,User} = req.body;
    if (!productId || !content ||!rating|| !User ) {
      return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii' });
    }
    const newComment = new Comment({ productId, content, rating,User });
   

    await newComment.save();
    res.status(201).send('Comment added successfully');
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment');
  }
});
app.get('/api/comments/product/:productId', async (req, res) => {
  try {
    const comments = await Comment.find({ productId: req.params.productId });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Error fetching comments');
  }
});

app.get('/api/allcomments', async (req, res) => {
  try {
    const comments = await Comment.find({},{  __v: 0 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Error fetching comments');
  }
});
app.delete('/api/comments/:id', async (req, res) => {
  const ordersid = req.params.id;
  try {
    // Găsirea și ștergerea produsului din baza de date
    const deletedorders = await Comment.findByIdAndDelete(ordersid);
    if (!deletedorders) {
      return res.status(404).json({ message: 'Produsul nu a fost găsit' });
    }
    res.status(200).json({ message: 'Produsul a fost șters cu succes' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const problemSchema = new mongoose.Schema({
  nume: String,
  email: String,
  mesaj:String
});
const problem = mongoose.model('Problems', problemSchema);

app.get('/api/problemsg', async (req, res) => {
  try {
    const comments = await problem.find({},{  __v: 0 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Error fetching comments');
  }
});
app.post('/api/problems', async (req, res) => {
  try {
    const { nume, email,mesaj} = req.body;
    const newComment = new problem({ nume, email, mesaj});
    await newComment.save();
    res.status(201).send('Comment added successfully');
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment');
  }
});

app.delete('/api/problems/:id', async (req, res) => {
  const ordersid = req.params.id;
  try {
    
    const deletedorders = await problem.findByIdAndDelete(ordersid);
    if (!deletedorders) {
      return res.status(404).json({ message: 'Produsul nu a fost găsit' });
    }
    res.status(200).json({ message: 'Produsul a fost șters cu succes' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
