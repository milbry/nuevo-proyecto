import React, { useState } from 'react';

export default function CommentsFull({ plantId }) {
  const [comments, setComments] = useState([
    { id: '1', userName: 'Alice', text: '¡Me encanta esta planta!', likes: ['user1'], userId: 'user1' },
    { id: '2', userName: 'Bob', text: 'La cuidé y floreció mucho 🌸', likes: [], userId: 'user2' },
    { id: '3', userName: 'Charlie', text: 'Tiene hojas muy bonitas', likes: ['user3', 'user4'], userId: 'user3' },
  ]);

  const [text, setText] = useState('');
  const [editing, setEditing] = useState(null);

  function post() {
    if (!text.trim()) return;
    if (editing) {
      setComments(comments.map(c => c.id === editing ? { ...c, text } : c));
      setEditing(null); setText('');
      return;
    }
    const newComment = {
      id: Date.now().toString(),
      userName: 'UsuarioPrueba',
      text,
      likes: [],
      userId: 'userTest',
    };
    setComments([newComment, ...comments]);
    setText('');
  }

  function toggleLike(c) {
    setComments(comments.map(comment => {
      if (comment.id !== c.id) return comment;
      const userId = 'userTest';
      const likes = comment.likes.includes(userId)
        ? comment.likes.filter(u => u !== userId)
        : [...comment.likes, userId];
      return { ...comment, likes };
    }));
  }

  function remove(c) {
    setComments(comments.filter(comment => comment.id !== c.id));
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Comentarios</h3>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        placeholder="Escribe tu comentario..."
      />
      <div className="flex gap-2 mb-4">
        <button onClick={post} className="bg-green-700 text-white px-4 py-2 rounded">
          {editing ? 'Guardar' : 'Comentar'}
        </button>
        {editing && (
          <button onClick={() => { setEditing(null); setText(''); }} className="px-4 py-2 border rounded">
            Cancelar
          </button>
        )}
      </div>

      <div className="space-y-3">
        {comments.map(c => (
          <div key={c.id} className="p-3 bg-green-50 rounded">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{c.userName}</div>
                <div className="text-sm text-slate-700">{c.text}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => toggleLike(c)}
                  className={`text-sm ${c.likes.includes('userTest') ? 'text-red-600' : 'text-slate-500'}`}
                >
                  ❤️ {c.likes.length}
                </button>
                {c.userId === 'userTest' && (
                  <div className="flex flex-col gap-1">
                    <button onClick={() => { setEditing(c.id); setText(c.text); }} className="text-xs text-amber-600">
                      Editar
                    </button>
                    <button onClick={() => remove(c)} className="text-xs text-red-600">Eliminar</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
