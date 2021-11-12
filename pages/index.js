import styles from "../styles/Home.module.css";
import { useLocalStorage } from "../hooks/useLocalStorage";
import TrashComponent from "../components/TrashComponent";
import PlusComponent from "../components/PlusComponent";
import Head from "../components/Head";
import { listNoteStyle, mainSpaceStyle, sidebarStyle } from "../styles/styles";
import { pushToArray, removeFromArray, truncate } from "../utils/lib";

export default function Home() {
  const [notes, setNotes] = useLocalStorage("notes", []);
  const [note, setNote] = useLocalStorage("note", "");
  const [activeNote, setActiveNote] = useLocalStorage("activeNote", 1);
  const [highestActiveNote, setHighestActiveNote] = useLocalStorage(
    "highestActiveNote",
    1
  );

  return (
    <div>
      <Head />
      <main>
        <div className={styles.main}>
          <div id="sidebar" style={sidebarStyle}>
            <div>
              {notes &&
                notes.map((note) => {
                  const tn = truncate(note.note, 15);
                  return (
                    <div
                      style={listNoteStyle}
                      onClick={() => {
                        setActiveNote(note.id);
                        setNote(note.note);
                      }}
                      key={notes.id}
                    >
                      <span>📍 {tn}</span>
                      <span
                        className={styles.trash}
                        onClick={() => {
                          note.note = "";
                          setNotes(removeFromArray(notes, note.id));
                        }}
                      >
                        <TrashComponent />
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
          <div style={mainSpaceStyle}>
            <textarea
              value={note}
              placeholder="Type your note here"
              onChange={(e) => {
                setNotes((notes) => [
                  ...pushToArray(notes, {
                    id: activeNote ? activeNote : 0,
                    note: e.target.value,
                  }),
                ]);
                setNote(e.target.value);
              }}
              spellCheck={false}
              autoFocus
            />
            <pre aria-hidden>{note}</pre>

            {notes && (
              <button
                className={styles.addButton}
                onClick={() => {
                  setNote("");
                  setHighestActiveNote(highestActiveNote++);
                  notes.push({ id: highestActiveNote, note: "" });

                  setActiveNote(highestActiveNote++);
                  setHighestActiveNote(highestActiveNote++);
                }}
              >
                <PlusComponent />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
