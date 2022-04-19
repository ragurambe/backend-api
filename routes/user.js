const express = require("express");
const router = express.Router();

const User = require("../models/User");
router.get("/", async (req, res) => {
  try {
    await User.find({}, "-createdAt -updatedAt")
      .then((result) => {
        if (result && result.length > 0) {
          res.status(200).send({ status: "success", data: result });
        } else {
          res.status(200).send({ status: "failed", message: "no users found" });
        }
      })
      .catch((e) => {
        res.status(500).send({ status: "failed", message: e.message });
      });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: "failed", message: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email_address,
      phone_number,
      profile_picture,
    } = req.body;
    await User.findOne({ email_address }, "-createdAt -updatedAt").then(
      async (user) => {
        if (user && user._id) {
          res
            .status(500)
            .send({ status: "failed", message: "user email already exists" });
        } else {
          await User.create({
            firstname,
            lastname,
            phone_number,
            email_address,
            profile_picture: "",
          }).then((result) => {
            console.log(result);
            if (result && result._id) {
              res.status(200).send({
                status: "success",
                message: "User profile added successfully",
              });
            } else {
              res.status(500).send({
                status: "failed",
                message:
                  "userprofile not updated. something went wrong, please try again!",
              });
            }
          });
        }
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: "failed", message: e.message });
  }
});

router.put("/:user_id", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email_address,
      phone_number,
      profile_picture,
    } = req.body;
    if (req.params.user_id) {
      await User.findByIdAndUpdate(
        { _id: req.params.user_id },
        {
          firstname,
          lastname,
          email_address,
          phone_number,
          profile_picture,
        }
      )
        .then((result) => {
          if (result && result) {
            res.status(200).send({
              status: "success",
              message: "User profile updated successfully",
              data: result,
            });
          } else {
            res
              .status(404)
              .send({ status: "failed", message: "user not found" });
          }
        })
        .catch((e) => {
          res.status(500).send({ status: "failed", message: e.message });
        });
    } else {
      res.status(500).send({
        status: "failed",
        message: "user id not found in request url",
      });
    }
  } catch (e) {
    res.status(500).send({ status: "failed", message: e.message });
  }
});

router.delete("/:user_id", async (req, res) => {
  try {
    if (req.params.user_id) {
      await User.deleteOne({ _id: req.params.user_id })
        .then((result) => {
          if (result && result) {
            res.status(200).send({
              status: "success",
              message: "User profile deleted successfully",
              data: result,
            });
          } else {
            res
              .status(404)
              .send({ status: "failed", message: "user not found" });
          }
        })
        .catch((e) => {
          res.status(500).send({ status: "failed", message: e.message });
        });
    } else {
      res.status(500).send({
        status: "failed",
        message: "user id not found in request url",
      });
    }
  } catch (e) {
    res.status(500).send({ status: "failed", message: e.message });
  }
});

module.exports = router;
