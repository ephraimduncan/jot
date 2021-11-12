import Head from "next/head";
import styles from "../styles/Home.module.css";
import { blue, indigo, tomato } from "@radix-ui/colors";
import { useLocalStorage } from "../hooks/useLocalStorage";

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
    ? "📍 " + str.slice(0, maxlength) + "..."
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
  //   key: "random-generated-key",
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
          </div>
        </div>
      </main>
    </div>
  );
}
