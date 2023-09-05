import logo from './logo.svg';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useState, useCallback, useEffect } from 'react';
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
  const [title, setTitle] = useState([])
  const [bookmarks, setBookmarks] = useState([[[]]]);
  const [position, setPosition] = useState(0);
  const [bookmarkNames, setbookmarkNames] = useState(['Formular'])
  const [text, setText] = useState('Zalozka' + bookmarkNames.length)
  const [text2, setText2] = useState('');

  const onDragEnd = useCallback((result) => {
    const { source, destination, draggableId } = result;

    try {
      if (!destination) {
        return;
      }
      const src = source.droppableId.split('-')
      const dest = destination.droppableId.split('-')

      if (src[0] === 'dropContainer') {
        secondItems[source.index] = secondItems.splice(destination.index, 1, secondItems[source.index])[0];
      }

      else if (src[0] === 'horizontal') {
        const srcRowIndex = src[1];
        const destRowIndex = dest[1];
        const srcItemIndex = source.index;
        const destItemIndex = destination.index;

        setSecondItems((prevSecondItems) => {
          const newSecondItems = [...prevSecondItems];
          const srcRow = newSecondItems[srcRowIndex];
          const destRow = newSecondItems[destRowIndex];
          const [movedItem] = srcRow.splice(srcItemIndex, 1);

          destRow.splice(destItemIndex, 0, movedItem);

          return newSecondItems;
        });
      }

      else {
        const [srcName, srcRow, srcCol] = src[0] === 'initial' || 'title' ? source.droppableId.split('-') : src.slice(1).map(Number);
        const [destName, destRow, destCol] = destination.droppableId.split('-');

        if (destName === 'vertical') {
          console.log('vertical tu :)');
          let sourceArray;
          let destinationArray
          if (srcRow === 'initial') {
            sourceArray = initialItems;
          } else if (srcRow === 'title') {
            sourceArray = title;
          }
          else {
            sourceArray = secondItems[srcRow][srcCol];
          }

          if (destRow === 'initial') {
            destinationArray = initialItems;
          } else if (destRow === 'title') {
            destinationArray = title;
          } else {
            destinationArray = secondItems[destRow][destCol];
          }
          const [movedItem] = sourceArray.splice(source.index, 1);

          destinationArray.splice(destination.index, 0, movedItem);
        }

        else if (destName === 'initial' && secondItems[srcRow][srcCol][0].class === 'item' && (srcName === 'vertical' || srcName === destName)) {
          let sourceArray;
          let destinationArray
          if (srcRow === 'initial') {
            sourceArray = initialItems;
          }
          else {
            sourceArray = secondItems[srcRow][srcCol];
          }

          if (destRow === 'initial') {
            destinationArray = initialItems;
          } else {
            destinationArray = secondItems[destRow][destCol];
          }
          const [movedItem] = sourceArray.splice(source.index, 1);

          destinationArray.splice(destination.index, 0, movedItem);
        }

        else if (destName === 'title' && secondItems[srcRow][srcCol][0].class === 'title' && (srcName === 'vertical' || srcName === destName)) {
          let sourceArray;
          let destinationArray
          if (srcRow === 'title') {
            sourceArray = title;
          }
          else {
            sourceArray = secondItems[srcRow][srcCol];
          }

          if (destRow === 'title') {
            destinationArray = title;
          } else {
            destinationArray = secondItems[destRow][destCol];
          }
          const [movedItem] = sourceArray.splice(source.index, 1);

          destinationArray.splice(destination.index, 0, movedItem);
        }
      }



      const clearedArrays = secondItems.map((row) => row.filter((clear) => clear.length > 0)).filter((cleared) => cleared.length > 0)

      clearedArrays.map((update) => update.splice(update.length, 0, []))
      clearedArrays.splice(clearedArrays.length, 0, [[]])



      const newBookmarks = [...bookmarks];

      newBookmarks[position] = [...clearedArrays];

      setInitialItems([...initialItems]);
      setSecondItems([...clearedArrays]);
      setBookmarks(newBookmarks);
    } catch (err) {
      console.error(err);
    }

  }, [initialItems, secondItems, title]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'text') {
      setText(value)
    } else if (name === 'text2') {
      setText2(value)
    }
  }

  const handleSubmit = (e, formName) => {
    e.preventDefault();
    if (formName === 'bookmarkForm') {
      if (!text.length) {
        return;
      }
      setBookmarks([...bookmarks, [[[]]]])
      setbookmarkNames([...bookmarkNames, text])
      setText('Zalozka' + (bookmarks.length + 1))
    }
    else if (formName === 'titleForm') {
      if (!text2.length) {
        return;
      }
      setTitle((prevTitle) => [
        ...prevTitle,
        { id: generateUniqueId(), title: text2, field: text2, class: 'title' },
      ]);
      setText2('');
    }
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
                    <Draggable key={item.id} draggableId={item.id} index={index}>
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
          <div className='titleContainer'>
            <Droppable droppableId={`title-title`} direction="vertical" type='item'>
              {(provided) => (
                <div className='schemaItems' {...provided.droppableProps} ref={provided.innerRef} >
                  {title.map((title, titleIndex) => (
                    <Draggable key={title.id} draggableId={title.id} index={titleIndex}>
                      {(provided) => (
                        <div className="items" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                          {title.title}
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
                                                <Draggable key={item.id} draggableId={item.id} index={index} type='item'>
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
          <form onSubmit={(e) => handleSubmit(e, 'titleForm')}>
            <input className="formInputButton"
              id="newBookmark"
              name='text2'
              value={text2}
              onChange={handleChange}
            />
            <button>
              Add a bookmark
            </button>
          </form>
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

            > {bookmarkNames[index]}

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

          <form onSubmit={(e) => handleSubmit(e, 'bookmarkForm')}>
            <input className="formInputButton"
              id="newBookmark"
              name='text'
              value={text}
              onChange={handleChange}
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
                      .map((item) => item.class === 'item' ? ({ field: item.field }) : ({ title: item.title }));
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
              bookmarkNames.map((name, index) => {
                filteredTransformedBookmarks[index].splice(0, 0, { bookmarkName: bookmarkNames[index] });
                return filteredTransformedBookmarks[index];
              })
              const jsonData = JSON.stringify(filteredTransformedBookmarks, null, 2);
              console.log(jsonData);
              const blob = new Blob([jsonData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);


              filteredTransformedBookmarks.map((bookmarkName, index) => filteredTransformedBookmarks.splice(index, 0, { bookmarkName: bookmarkNames[index] }))
              const a = document.createElement('a');
              a.href = url;
              a.download = 'Gui.json';
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
