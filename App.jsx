// --- Studying-Smart MVP App ---
// React + Firebase Q&A + Resource Upload

import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

export default function App() {
  const [subject, setSubject] = useState("math");
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadBody, setUploadBody] = useState("");
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "questions"), where("subject", "==", subject));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setQuestions(data);
    });
    return () => unsubscribe();
  }, [subject]);

  useEffect(() => {
    const fetchUploads = async () => {
      const snapshot = await getDocs(query(collection(db, "uploads"), where("subject", "==", subject)));
      setUploads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUploads();
  }, [subject]);

  const handleSubmitQuestion = async () => {
    if (question.trim()) {
      await addDoc(collection(db, "questions"), {
        text: question,
        subject,
        created: Date.now(),
        answer: "Answer coming soon...",
      });
      setQuestion("");
    }
  };

  const handleUpload = async () => {
    if (uploadTitle.trim() && uploadBody.trim()) {
      await addDoc(collection(db, "uploads"), {
        title: uploadTitle,
        body: uploadBody,
        subject,
        created: Date.now(),
      });
      setUploadTitle("");
      setUploadBody("");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Studying Smart</h1>

      <div className="mb-4">
        <label className="block font-semibold">Select a subject:</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="math">Math</option>
          <option value="biology">Biology</option>
          <option value="english">English</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block font-semibold">Ask a question:</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border p-2 rounded w-full"
          rows={3}
        />
        <button
          onClick={handleSubmitQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Submit Question
        </button>
      </div>

      <div className="mb-6">
        <label className="block font-semibold">Upload a study guide or summary:</label>
        <input
          type="text"
          placeholder="Title"
          value={uploadTitle}
          onChange={(e) => setUploadTitle(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          value={uploadBody}
          onChange={(e) => setUploadBody(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Write your summary, explanation, or guide here"
          rows={5}
        />
        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded mt-2"
        >
          Upload Resource
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Recent Questions:</h2>
        {questions.map((q) => (
          <div key={q.id} className="border-b py-2">
            <p className="font-medium">Q: {q.text}</p>
            <p className="text-gray-700 ml-4">A: {q.answer}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Uploaded Resources:</h2>
        {uploads.map((u) => (
          <div key={u.id} className="border-b py-2">
            <p className="font-medium">📘 {u.title}</p>
            <p className="text-gray-700 ml-4 whitespace-pre-wrap">{u.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
