import Head from "next/head";
import styles from "../styles/Home.module.css";
import { blue, indigo, tomato, red } from "@radix-ui/colors";
import { useLocalStorage } from "../hooks/useLocalStorage";

const PlusComponent = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    ></path>
  </svg>
);

const TrashComponent = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    ></path>
  </svg>
);

const commonStyle = {
  padding: "2rem",
  height: "100vh",
};

const sidebarStyle = {
  ...commonStyle,
  background: tomato.tomato3,
  width: "25%",
  color: tomato.tomato11,
  borderRight: `1px solid ${blue.blue5}`,
};

const mainSpaceStyle = {
  ...commonStyle,
  background: indigo.indigo3,
  width: "75%",
  color: indigo.indigo11,
};

function truncate(string, maxlength) {
  const str = string.replace(/(?:\r\n|\r|\n)/g, " ");
  return str.length > maxlength ? str.slice(0, maxlength).trim() + "..." : str;
}

function pushToArray(arr, obj) {
  const array = arr || [];
  const index = array.findIndex((e) => {
    return e.id === obj.id;
  });

  if (index === -1) {
    array.push(obj);
  } else {
    array[index] = obj;
  }
  return array;
}

function removeFromArray(arr, id) {
  return arr.filter((e) => e.id !== id);
}

export default function Home() {
  const [notes, setNotes] = useLocalStorage("notes", []);
  const [note, setNote] = useLocalStorage("note", "");
  const [activeNote, setActiveNote] = useLocalStorage("activeNote", 0);

  return (
    <div>
      <Head>
        <title>Writer</title>
        <meta name="description" content="Simple Note Taking App" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.main}>
          <div style={sidebarStyle}>
            <div>
              {notes.map((note) => {
                const tn = truncate(note.note, 15);
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignContent: "center",
                      marginBottom: "1rem",
                      cursor: "default",
                      padding: "1rem",
                      borderRadius: "6px",
                      background: red.red4,
                    }}
                    onClick={() => {
                      setActiveNote(note.id);
                      setNote(note.note);
                    }}
                  >
                    <span>📍 {tn}</span>
                    <span
                      className={styles.trash}
                      onClick={() => setNotes(removeFromArray(notes, note.id))}
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

            <button
              className={styles.addButton}
              onClick={() => {
                setNote("");
                setActiveNote(activeNote + 1);
              }}
            >
              <PlusComponent />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
