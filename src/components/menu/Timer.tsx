import React, { useEffect, useState, useImperativeHandle, forwardRef, Ref } from 'react';
import styled from 'styled-components';

interface TimerProps {
    onTimeUp?: () => void;
}

const TimerWrapper = styled.div`
  grid-area: timer;
    height: 5vh;
  border: 1px solid ${({ theme }) => theme.timerBorderColor};
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.timerColor};
`;

const Timer = forwardRef((props: TimerProps, ref: Ref<{ resetTimer: () => void }>) => {
    const [timeLeft, setTimeLeft] = useState(30);

    useImperativeHandle(ref, () => ({
        resetTimer() {
            setTimeLeft(30);
        }
    }));

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else if (props.onTimeUp) {
            props.onTimeUp();
        }
    }, [timeLeft, props]);

    return (
        <TimerWrapper>
            <h2>남은시간</h2>
            <p>{timeLeft}초</p>
        </TimerWrapper>
    );
});

export default Timer;
