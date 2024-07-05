const express = require("express");
const mongoose = require("mongoose");
const Rooms = require("./dbRooms");
const Messages = require("./dbMessages");
const cors = require("cors");
const Pusher = require("pusher");

const app = express();

const pusher = new Pusher({
  appId: "1829519",
  key: "9221b5c9e1102198e67b",
  secret: "ad4518ccfccdbae7f2df",
  cluster: "ap2",
  useTLS: true
});

const PORT = 5000;
const dbUrl = "mongodb+srv://asmamalica:Asma%402004@streamapps.auqrlty.mongodb.net/whatsappclone?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());

mongoose.connect(dbUrl).then(() => {
  console.log("DB connected");

  const roomChangeStream = Rooms.watch();
  roomChangeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const roomDetails = change.fullDocument;
      pusher.trigger("rooms", "inserted", {
        _id: roomDetails._id,
        name: roomDetails.name,
      });
    } else if (change.operationType === "delete") {
      pusher.trigger("rooms", "deleted", change.documentKey._id);
    }
  });

  const messageChangeStream = Messages.watch();
  messageChangeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        _id: messageDetails._id,
        message: messageDetails.message,
        name: messageDetails.name,
        timestamp: messageDetails.timestamp,
        uid: messageDetails.uid,
        roomId: messageDetails.roomId,
      });
    }
  });

}).catch(err => {
  console.error("DB connection error:", err);
});

app.get("/", (req, res) => {
  res.send("Hello from backend");
});

app.get("/room/:id", async (req, res) => {
  try {
    const room = await Rooms.findById(req.params.id);
    res.status(200).send(room);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/messages/:id", async (req, res) => {
  try {
    const messages = await Messages.find({ roomId: req.params.id });
    res.status(200).send(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/messages/new", async (req, res) => {
  try {
    const message = await Messages.create(req.body);
    res.status(201).send(message);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/group/create", async (req, res) => {
  try {
    const room = await Rooms.create({ name: req.body.groupName });
    res.status(201).send(room);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/all/rooms", async (req, res) => {
  try {
    const rooms = await Rooms.find({});
    res.status(200).send(rooms);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
