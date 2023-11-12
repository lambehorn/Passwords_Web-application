const express = require("express");
const { connect, default: mongoose } = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const PORT = 3000;

// const router = require('./router')

// настройки шаблонизатора
const hbs = require(`hbs`);
app.set(`views`, `views`);
app.set(`view engine`, `hbs`);

// статика
app.use(express.static(`public`));

// парсинг json
app.use(express.json());

// обработка post
app.use(express.urlencoded({ extended: true }));

// подключение к бд
mongoose.connect(`mongodb://127.0.0.1:27017/passwords`);

// запуск сервера
const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(`Ошибка! 05: ${e}`);
  }
};

start();

// models

// user
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  create_at: {
    type: Date,
    require: true,
  },
});
const User = mongoose.model("User", UserSchema);

// application
const ApplicationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.ObjectId,
    required: true,
  },
  application: {
    type: String,
    required: true,
  },
});
const Application = mongoose.model("Application", ApplicationSchema);

// account
const AccountSchema = new mongoose.Schema({
  application_id: {
    type: mongoose.ObjectId,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: false,
  },
});
const Account = mongoose.model("Account", AccountSchema);

// Routs

// регистрация
app.post("/reg", async (req, res) => {
  try {
    const { name, firstName, password, mail } = req.body;

    const userReprat = await User.findOne({
      mail: mail,
    });
    if (!userReprat) {
      const hashPassword = await bcrypt.hash(String(password), 5);

      const NewUser = new User({
        name: name,
        firstName: firstName,
        password: hashPassword,
        mail: mail,
        create_at: Date(),
      });
      await NewUser.save();

      const user = await User.findOne({
        mail: mail,
      });

      res.redirect(`/office?_id=${user._id}`);
    } else {
      res.send("Ошибка!  01");
    }
  } catch (e) {
    console.log(`Ошибка: ${e}`);
  }
});

// вход
app.post("/login", async (req, res) => {
  try {
    const { mail, password } = req.body;

    let user = await User.findOne({
      mail: mail,
    });

    if (!user) {
      res.send("такого пользователя не существует!");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.send(checkPassword);
    }
    if (checkPassword) {
      res.redirect(`/office?_id=${user._id}`);
    } else {
      res.send("Ошибка! 02");
    }
  } catch (e) {
    console.log(`Ошибка: ${e}`);
  }
});

// добавление приложения
app.post("/office/addApplication", async (req, res) => {
  try {
    const user_id = req.query._id;
    const applicationName = req.body.name;

    const applicationRepeat = await Application.findOne({
      user_id: user_id,
      application: applicationName,
    });

    if (!applicationRepeat) {
      const newApplication = new Application({
        user_id: user_id,
        application: applicationName,
      });
      await newApplication.save();
      res.redirect("back");
    } else {
      res.send("Ошибка! 03");
    }
  } catch (e) {
    console.log(`Ошибка: ${e}`);
  }
});

// Удаление приложения
app.post("/office/deleteApplication", async (req, res) => {
  try {
    const application_id = req.query._id;

    await Account.deleteMany({
      application_id:application_id
    })


    await Application.deleteOne({
      _id: application_id,
    });

    res.redirect("back");
  } catch (e) {
    console.log(`Ошибка: ${e}`);
  }
});

// добавление Аккаунта

app.post("/office/Application/addAccount", async (req, res) => {
  try {
    const application_id = req.query._id;
    const { accountName, password, mail } = req.body;

    const account = await Account.findOne({
      mail: mail,
    });

    if (!account) {
      const newAccount = new Account({
        application_id: application_id,
        accountName: accountName,
        password: password,
        mail: mail,
      });

      newAccount.save();

      res.redirect("back");
    } else {
      res.send("Ошибка! 04");
    }
  } catch (e) {
    console.log(`Ошибка: ${e}`);
  }
});

// удаление Аккаунта

app.post("/office/Application/deleteAccount", async (req, res) => {
  try {
    const account_id = req.query._id;

    await Account.deleteOne({
      _id: account_id,
    });

    res.redirect("back")
  } catch (e) {
    console.log(`Ошибка! 05: ${e}`);
  }
});

// страница входа

app.get("/", (req, res) => {
  res.render("login");
});

// личный кабинет
app.get("/office", async (req, res) => {
  const user_id = req.query._id;
  const user = await User.findOne({
    _id: user_id,
  });
  const application = await Application.find({
    user_id: user._id,
  });
  if (user) {
    res.render("office", { user: user, app: application });
  } else {
    res.send("ошибка! 06");
  }
});

// аккаунты приложения
app.get("/application", async (req, res) => {
  const application_id = req.query._id;

  const application = await Application.findOne({
    _id: application_id,
  });

  if (application) {
    var account = await Account.find({
      application_id: application_id,
    });

    if (account) {
      var user = await User.findOne({
        _id: application.user_id,
      });

      if (user){
        res.render("account", { acc: account, user: user, app: application });

      }else{
        res.send("ошибка 3")
      }
    } else {
      res.send("ошибка 2");
    }
  } else {
    res.send("ошибка 1");
  }

});
