const express = require("express");
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Note = require("../models/Note");
//Route 1 : Get All the Notes using :GET "/api/notes/fetchallnotes" .Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });

    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});

//Route 2 : Add a new note :POST "/api/notes/addnote" .Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //if there are errors return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//Route 3 : Update an existing Note usin :POST "/api/notes/updatenote" .Login required
router.put(
  "/updatenote/:id",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const newnote = {};
      if (title) {
        newnote.title = title;
      }
      if (description) {
        newnote.description = description;
      }
      if (tag) {
        newnote.tag = tag;
      }

      let note = await Note.findById(req.params.id);
      if (!note) {
        res.status(404).send("Not found");
      }
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
      }

      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newnote },
        { new: true }
      );
      res.json(note);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);
//Route 4 : Delete an existing Note using :DELETE "/api/notes/deletenote" .Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).send("Not found");
    }

    //Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});
//find a note to be deleted and delete it

module.exports = router;
