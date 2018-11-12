import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Task from './task';

const Container = styled.div`
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    flex-basis: ${props => (props.className === 'question' ? '100%' : '50%')}
    max-width: ${props => (props.className === 'question' ? '100%' : '50%')}
    box-sizing: border-box;
    margin: ${props => (props.className === 'question' ? '0 1rem 1rem' : '0 0 1rem')}
`;
const Title = styled.h3`
    padding: 8px;
    text-align: center;
    color: #FFF;
`;
const TaskList = styled.div`
    transition: border-color 0.5s ease;
    border: 2px dashed white;
    border-color: ${props => (props.isDraggingOver ? props.dragColour : 'white')}
    background-color: ${props => (props.column === 'question' ? 'white' : 'transparent')}
    height: ${props => (props.column === 'question' ? '160px' : '100px')}
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    margin: .5rem;
    border-radius: 8px;
    font-size: 22px;
`;

const Icon = styled.div`
    color: #FFF;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const Complete = styled.div`
    color: #FFF;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: black;
    p {
        font-size: 16px;
        color: #1B307D;
    }
    button {
        margin-top: 1rem;
        height: 50px;
        padding: 0 2rem;
        background-color: #1B307D;
        border: 0;
        border-radius: 3px;
        font-size: 12px;
        text-transform: uppercase;
        color: #FFF;
        cursor: pointer;
    }
`

class Column extends React.Component {

    complete = () => <Complete><p>Complete</p><button>Finish</button></Complete>;

    render() {

        const dragColour = this.props.activeDestination.destination === 'correct' ? 'green'
            : this.props.activeDestination.destination === 'incorrect' ? 'red' : 'skyblue';

        const background = this.props.column.id === 'correct' ? '✅'
            : this.props.column.id === 'incorrect' ? '❌' : '';


        return (
            <Container
            className={this.props.column.id}
            border={dragColour}>
                <Title>{this.props.column.title}</Title>
                <Droppable 
                    droppableId={this.props.column.id}
                    isDropDisabled={this.props.column.id === 'question'}>
                {(provided, snapshot) => (
                    <TaskList
                        innerRef={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                        dragColour={dragColour}
                        column={this.props.column.id}
                    >
                        {this.props.tasks.map((task, index) =>
                            <Task key={task.id}
                                task={task}
                                index={index}
                                column={this.props.column.id}
                                activeDestination={this.props.activeDestination}
                                length={this.props.questionLength}
                            />)}
                            {background ? <Icon>{background}</Icon>
                            : this.props.tasks.length === 0 ? this.complete() : null}
                        {provided.placeholder}
                    </TaskList>
                )}
                </Droppable>
            </Container>
        )
    }
}

export default Column;