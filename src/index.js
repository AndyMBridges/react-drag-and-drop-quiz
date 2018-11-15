import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 1rem auto;
    max-width: 400px;
    padding: 0 1rem;
`;

const Response = styled.div`
    color: #FFF;
    text-align: center;
    width: 100%;
`;

document.body.style.backgroundColor = '#2C48B1';

class App extends React.Component {
    state = {
        initialData,
        activeDestination: {},
        response: ''
    };

    onDragEnd = result => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = this.state.initialData.columns[source.droppableId];
        const finish = this.state.initialData.columns[destination.droppableId];


        if (start !== finish) {

            this.updateCards(start, finish, destination, source, draggableId);

            this.checkAnswer(finish);

        }


    }

    checkAnswer = finish => {
        const questionCard = this.state.initialData.columns[finish.id].taskIds.map(taskId => this.state.initialData.tasks[taskId])[0];
        const answerStatus = questionCard.isCorrect ? 'correct' : 'incorrect';
        const isCorrect = answerStatus === finish.id;

        this.setState({
            response: isCorrect ? questionCard.correctResponse : questionCard.incorrectResponse 
        })
    }

    updateCards = (start, finish, destination, source, draggableId) => {

        // Moving from one list to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        }

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds
        };

        const newState = {
            ...this.state.initialData,
            columns:{
                ...this.state.initialData.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish
            }
        }

        this.setState({initialData: newState});
    }

    droppableClick = id => {
        const start = this.state.initialData.columns['question'];
        const finish = this.state.initialData.columns[id];

        const sourceIndex = this.state.initialData.columns.question.taskIds.length - 1;

        const draggableId = this.state.initialData.columns.question.taskIds[this.state.initialData.columns.question.taskIds.length - 1]

        if (sourceIndex >= 0) {

            const startTaskIds = Array.from(start.taskIds);
            startTaskIds.splice(sourceIndex, 1);
            const newStart = {
                ...start,
                taskIds: startTaskIds,
            }

            const finishTaskIds = Array.from(finish.taskIds);
            finishTaskIds.splice(0, 0, draggableId);
            const newFinish = {
                ...finish,
                taskIds: finishTaskIds
            };

            const newState = {
                ...this.state.initialData,
                columns:{
                    ...this.state.initialData.columns,
                    [newStart.id]: newStart,
                    [newFinish.id]: newFinish
                }
            }

            // Check answers in callback after setState
            this.setState({initialData: newState}, () => this.checkAnswer(finish));

        }

    }

    onDragUpdate = result => {

        // Check if there is a destination then check if it's correct
        if (result.destination) {
            this.setState({
                activeDestination: {
                    id: result.draggableId,
                    destination: result.destination.droppableId
                }
            })
        }
    }

    onDragStart = () => {
        console.log('started dragging');
    }

    render() {

        const questionLength = Object.keys(this.state.initialData.tasks).length;

        return (
            <DragDropContext 
                onDragEnd={this.onDragEnd}
                onDragStart={this.onDragStart}
                onDragUpdate={this.onDragUpdate}
                >
                <Container>
                    {this.state.initialData.columnOrder.map((columnId) => {
                        const column = this.state.initialData.columns[columnId];
                        const tasks = column.taskIds.map(taskId => this.state.initialData.tasks[taskId]);

                        return <Column
                            key={column.id}
                            column={column}
                            tasks={tasks}
                            activeDestination={this.state.activeDestination} 
                            questionLength={questionLength} 
                            droppableClick={this.droppableClick}/>;
                    })}
                    <Response>{this.state.response}</Response>
                </Container>
            </DragDropContext>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
