import React from 'react';

// receive two props: a title and the thoughts array. 
// destructure the argument data to avoid using props.title and props.thoughts
const ThoughtList = ({ thoughts, title }) => {
    //conditionally render thoughts.
  if (!thoughts.length) {
    //if no thoughts return this
    return <h3>No Thoughts Yet</h3>;
  }
// else return map list of thoughts
    return (
        <div>
            <h3>{title}</h3>
            {thoughts && 
            thoughts.map(thought => (
                <div key={thought._id} className="card mb-3">
                    <p className="card-header">
                        {thought.username}
                        thought on {thought.createdAt}
                    </p>
                    <div className="card-body">
                        <p>{thought.thoughtText}</p>
                        <p className="mb-0">
                        {/* conditionally displaying a message to contextualize 
                        what the call to action should be. */}
                            Reactions: {thought.reactionCount} || Click to {' '}
                            {thought.reactionCount ? 'see' : 'start'} the discussion!
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default ThoughtList;