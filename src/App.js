import logo from './logo.svg';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';

//schemas import
import schema1 from './schemas/schema.json';
import schema2 from './schemas/schema_2.json';
import schema3 from './schemas/schema_3.json';

function App() {
  const generateUniqueId = () => {
    return Math.random().toString(36);
  };

  const addIdsToSchema = (schema) => {
    return schema.map((item) => ({
      ...item,
      id: generateUniqueId(),
      class: 'item'
    }));
  };

  const schemaId = addIdsToSchema(schema1);

  const [initialItems, setInitialItems] = useState(schemaId);
  const [secondItems, setSecondItems] = useState([[[]]]);
  const [bookmarks, setBookmarks] = useState([[[]]]);
  const [position, setPosition] = useState(0);
  const [bookmarkName, setBookmarkName] = useState(['Formular'])
  const [text, setText] = useState('Zalozka' + bookmarkName.length)
  const onDragEnd = useCallback((result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    const src = source.droppableId.split('-')
    const dest = destination.droppableId.split('-')

    if (src[0] === 'dropContainer') {
      secondItems[source.index] = secondItems.splice(destination.index, 1, secondItems[source.index])[0];
      console.log(secondItems)
    }

    else if (src[0] === 'horizontal') {
      const temp = secondItems[src[1]][source.index]
      secondItems[src[1]][source.index] = secondItems[dest[1]][destination.index]
      secondItems[dest[1]][destination.index] = temp
      if (src[1] !== dest[1]) {
        secondItems[src[1]].splice(source.index, 1)
      }
      console.log(secondItems)
    }

    else {

      const [srcRow, srcCol] = src[0] === 'initial' ? source.droppableId.split('-') : src.slice(1).map(Number);
      const [_, destRow, destCol] = destination.droppableId.split('-');

      console.log(source, destination)

      const sourceArray = srcRow === 'initial' ? initialItems : secondItems[srcRow][srcCol];
      const destinationArray = destRow === 'initial' ? initialItems : secondItems[destRow][destCol];
      const [movedItem] = sourceArray.splice(source.index, 1);

      destinationArray.splice(destination.index, 0, movedItem);
    }

    const clearedArrays = secondItems.map((row) => row.filter((clear) => clear.length > 0)).filter((cleared) => cleared.length > 0)

    clearedArrays.map((update) => update.splice(update.length, 0, []))
    clearedArrays.splice(clearedArrays.length, 0, [[]])

    const newBookmarks = [...bookmarks];

    newBookmarks[position] = [...clearedArrays];

    setInitialItems([...initialItems]);
    setSecondItems([...clearedArrays]);
    setBookmarks(newBookmarks);
  }, [initialItems, secondItems]);

  const handleChange = (e) => {
    setText(e.target.value)
    console.log(text);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.length) {
      return;
    }

    setBookmarks([...bookmarks, [[[]]]])
    console.log([...bookmarkName])
    setBookmarkName([...bookmarkName, text])
    setText('Zalozka' + (bookmarks.length + 1))
  }

  return (
    <div className="App">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="container">
          <div className='schemaContainer'>
            <Droppable droppableId={`initial-initial`} direction="vertical" type='item'>
              {(provided) => (
                <div className='schemaItems' {...provided.droppableProps} ref={provided.innerRef} >
                  {initialItems.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index} type='item'>
                      {(provided) => (
                        <div className="items" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                          {item.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className='dropContainer'>
            <Droppable droppableId='dropContainer-dropContainer' type='row'>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>

                  {secondItems.map((row, rowIndex) => (
                    <Draggable key={`row-${rowIndex}`} draggableId={`row-${rowIndex}`} index={rowIndex} type='row'>
                      {(provided) => (
                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                          <Droppable key={`horizontal-${rowIndex}`} droppableId={`horizontal-${rowIndex}`} direction="horizontal">

                            {(provided) => (
                              <div className="dropItemsHorizontal" {...provided.droppableProps} ref={provided.innerRef}>
                                {row.map((column, columnIndex) => (
                                  <Draggable key={`vertical-${columnIndex}`} draggableId={`vertical-${rowIndex}-${columnIndex}`} index={columnIndex} type='col'>
                                    {(provided) => (
                                      <div className='dragItemsVertical' {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                        <Droppable key={`vertical-${rowIndex}-${columnIndex}`} droppableId={`vertical-${rowIndex}-${columnIndex}`} direction="vertical" type='item'>
                                          {(provided) => (
                                            <div className={columnIndex === row.length - 1 ? 'lastOne' : 'dropItemsVertical'} {...provided.droppableProps} ref={provided.innerRef}>
                                              {column.map((item, index) => (
                                                <Draggable key={item.id} draggableId={item.id} index={index} type={item.class}>
                                                  {(provided) => (
                                                    <div className='items' {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                      {item.title}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                              {provided.placeholder}
                                            </div>
                                          )}
                                        </Droppable>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

        </div>
      </DragDropContext>
      <div className='schemaContainer'>
        <div className='schemaItems'>
          {bookmarks.map((bookmark, index) => (
            <div className='bookmarkItems'
              key={index}
              onClick={() => {
                if (index === position) {
                  return false;
                }
                setPosition(index)
                setSecondItems(bookmarks[index])
              }}

            > {bookmarkName[index]}

              {index > 0 && (
                
                <X className='X' data-lucide-name="x"
                  onClick={() => {
                    const flatBookmark = [...bookmarks[index].flat()];
                    const returnedItems = [...initialItems, ...flatBookmark.flat()];

                    const updatedBookmarks = [...bookmarks];
                    updatedBookmarks.splice(index, 1);
                    setBookmarks(updatedBookmarks);
                    setInitialItems(returnedItems);
                    setSecondItems([[[]]])
                    setText('Zalozka' + (bookmarks.length - 1))
                  }}
                />
              )}
            </div>
          ))}

          <form onSubmit={handleSubmit}>
            <label htmlFor="newBookmark">
            </label>
            <input className="formInputButton"
              id="newBookmark"
              onChange={handleChange}
              value={text}
            />
            <button>
              Add a bookmark
            </button>
          </form>



          <button
            onClick={() => {
              const transformedBookmarks = bookmarks.map((bookmarkGroup) => {
                return bookmarkGroup.map((bookmarkRow) => {
                  return bookmarkRow.map((bookmarkColumn) => {
                    return bookmarkColumn
                      .filter((item) => item.title && item.field)
                      .map((item) => ({ field: item.field }));
                  });
                });
              });

              const filteredTransformedBookmarks = transformedBookmarks
                .map((bookmarkGroup) =>
                  bookmarkGroup.map((bookmarkRow) =>
                    bookmarkRow.filter((bookmarkColumn) => bookmarkColumn.length > 0)
                  )
                )
                .map((bookmarkGroup) => bookmarkGroup.filter((bookmarkRow) => bookmarkRow.length > 0));

              const jsonData = JSON.stringify(filteredTransformedBookmarks, null, 2);
              console.log(jsonData);
              const blob = new Blob([jsonData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);

              const a = document.createElement('a');
              a.href = url;
              a.download = 'clearedGui.json';
              a.click();

              URL.revokeObjectURL(url);
            }}
          >
            stringify
          </button>
          <button
            onClick={() => {

            }}
          >
            Add a line
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
