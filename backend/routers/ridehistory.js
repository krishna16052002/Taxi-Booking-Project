const express = require('express');
require('dotenv').config();
const createrideModel = require("../models/createride");
const { default: mongoose } = require('mongoose');
const router = express();

