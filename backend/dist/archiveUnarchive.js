"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
app.put('/Task/:taskId/archive', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskId;
        const updatedNote = yield prisma.note.update({
            where: { id: taskId },
            data: { isArchived: true },
        });
        res.status(200).json({ message: 'Note archived successfully', updatedNote });
    }
    catch (error) {
        console.error('Error archiving note:', error);
        res.status(500).json({ error: 'Error archiving note', details: error.message });
    }
}));
app.put('/Task/:taskId/unarchive', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskId;
        const updatedNote = yield prisma.note.update({
            where: { id: taskId },
            data: { isArchived: false },
        });
        res.status(200).json({ message: 'Note unarchived successfully', updatedNote });
    }
    catch (error) {
        console.error('Error unarchiving note:', error);
        res.status(500).json({ error: 'Error unarchiving note', details: error.message });
    }
}));
