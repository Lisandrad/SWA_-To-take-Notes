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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.Router)();
//endPoints
app.get('/', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const noteList = yield prisma.note.findMany();
    console.log(noteList);
    resp.send(noteList);
}));
//method POST
app.post('/', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { noteName, noteDescription } = req.body;
        const existingNote = yield prisma.note.findFirst({
            where: {
                noteName: noteName,
                noteDescription: noteDescription,
            },
        });
        if (existingNote) {
            return resp.status(400).json({ message: 'Note already exists' });
        }
        const newNote = yield prisma.note.create({
            data: {
                noteName: noteName,
                noteDescription: noteDescription,
                isArchived: false,
            },
        });
        resp.status(201).json({ message: 'Note added successfully', newNote });
    }
    catch (error) {
        console.error('Error adding note:', error);
        resp.status(500).json({ error: 'Error adding note', details: error.message });
    }
}));
//method PUT
app.put('/', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { noteName, noteDescription, id } = req.body;
        const existingNote = yield prisma.note.findUnique({
            where: {
                id: id,
            },
        });
        if (!existingNote) {
            return resp.status(404).json({ message: 'Note not found' });
        }
        const updatedNote = yield prisma.note.update({
            where: {
                id: id,
            },
            data: {
                noteName: noteName || existingNote.noteName,
                noteDescription: noteDescription || existingNote.noteDescription,
            },
        });
        resp.status(200).json({ message: 'Note updated successfully', updatedNote });
    }
    catch (error) {
        console.error('Error updating note:', error);
        resp.status(500).json({ error: 'Error updating note', details: error.message });
    }
}));
app.delete('/', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteId = req.query.noteId;
        const existingNote = yield prisma.note.findUnique({
            where: {
                id: noteId,
            },
        });
        if (!existingNote) {
            return resp.status(404).json({ message: 'Note not found' });
        }
        yield prisma.note.delete({
            where: {
                id: noteId,
            },
        });
        resp.status(200).json({ message: 'Note deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting note:', error);
        resp.status(500).json({ error: 'Error deleting note', details: error.message });
    }
}));
//to archive/unarchive notes.
app.put('/archive', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteId = req.query.noteId;
        console.log('aqui ta el taskId', noteId);
        const existingNote = yield prisma.note.findUnique({
            where: { id: noteId },
        });
        console.log(existingNote);
        if (!existingNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        console.log('aqui ta el existingTask', existingNote);
        const updatedNote = yield prisma.note.update({
            where: { id: noteId },
            data: { isArchived: true },
        });
        res.status(200).json({ message: 'Note archived successfully', updatedNote });
    }
    catch (error) {
        console.error('Error archiving note:', error);
        res.status(500).json({ error: 'Error archiving note', details: error.message });
    }
}));
app.put('/unarchive', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteId = req.query.noteId;
        const existingNote = yield prisma.note.findUnique({
            where: { id: noteId },
        });
        if (!existingNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        const updatedNote = yield prisma.note.update({
            where: { id: noteId },
            data: { isArchived: false },
        });
        res.status(200).json({ message: 'Note unarchived successfully', updatedNote });
    }
    catch (error) {
        console.error('Error unarchiving note:', error);
        res.status(500).json({ error: 'Error unarchiving note', details: error.message });
    }
}));
exports.default = app;
