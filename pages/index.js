import Head from "next/head";
import styles from "../styles/Home.module.css";
import { blue, indigo, red, tomato } from "@radix-ui/colors";
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
      fill-rule="evenodd"
      clip-rule="evenodd"
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

const findArray = (array, key) => array.find((note) => note.key === key);

function truncate(str, maxlength) {
  return +str.length > maxlength
    ? "📍 " + str.slice(0, maxlength).trim() + "..."
    : "📍 " + str;
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

export default function Home() {
  const [notes, setNotes] = useLocalStorage("notes", []);
  const [note, setNote] = useLocalStorage("note", "");

  // const note = {
  //   id: number,
  //   text: "note-text",
  // };

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
              {notes &&
                notes.map((note) => {
                  return <div>{truncate(note.note, 5)}</div>;
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
                    id: notes ? notes.length - 1 : 0,
                    note: e.target.value,
                  }),
                ]);
                setNote(e.target.value);
              }}
              spellCheck={false}
              autoFocus
            />
            <pre aria-hidden>{note}</pre>

            <button className={styles.addButton}>
              <PlusComponent />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
