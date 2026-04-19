import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function DecryptedText({
    text,
    speed = 50,
    maxIterations = 10,
    sequential = false,
    revealDirection = 'start',
    useOriginalCharsOnly = false,
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
    className = '',
    parentClassName = '',
    encryptedClassName = '',
    animateOn = 'hover',
    clickMode = 'once',
    loop = false,
    pauseTime = 1000,
    ...props
}) {
    const [displayText, setDisplayText] = useState(text);
    const [isAnimating, setIsAnimating] = useState(false);
    const [revealedIndices, setRevealedIndices] = useState(new Set());
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isDecrypted, setIsDecrypted] = useState(animateOn !== 'click');
    const [direction, setDirection] = useState('forward');

    const containerRef = useRef(null);
    const orderRef = useRef([]);
    const pointerRef = useRef(0);
    const intervalRef = useRef(null);

    const availableChars = useMemo(() => {
        return useOriginalCharsOnly
            ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
            : characters.split('');
    }, [useOriginalCharsOnly, text, characters]);

    const shuffleText = useCallback(
        (originalText, currentRevealed) => {
            return originalText
                .split('')
                .map((char, i) => {
                    if (char === ' ') return ' ';
                    if (currentRevealed.has(i)) return originalText[i];
                    return availableChars[Math.floor(Math.random() * availableChars.length)];
                })
                .join('');
        },
        [availableChars]
    );

    const computeOrder = useCallback(
        len => {
            const order = [];
            if (len <= 0) return order;
            if (revealDirection === 'start') {
                for (let i = 0; i < len; i++) order.push(i);
                return order;
            }
            if (revealDirection === 'end') {
                for (let i = len - 1; i >= 0; i--) order.push(i);
                return order;
            }
            // center
            const middle = Math.floor(len / 2);
            let offset = 0;
            while (order.length < len) {
                if (offset % 2 === 0) {
                    const idx = middle + offset / 2;
                    if (idx >= 0 && idx < len) order.push(idx);
                } else {
                    const idx = middle - Math.ceil(offset / 2);
                    if (idx >= 0 && idx < len) order.push(idx);
                }
                offset++;
            }
            return order.slice(0, len);
        },
        [revealDirection]
    );

    const fillAllIndices = useCallback(() => {
        const s = new Set();
        for (let i = 0; i < text.length; i++) s.add(i);
        return s;
    }, [text]);

    const removeRandomIndices = useCallback((set, count) => {
        const arr = Array.from(set);
        for (let i = 0; i < count && arr.length > 0; i++) {
            const idx = Math.floor(Math.random() * arr.length);
            arr.splice(idx, 1);
        }
        return new Set(arr);
    }, []);

    const encryptInstantly = useCallback(() => {
        const emptySet = new Set();
        setRevealedIndices(emptySet);
        setDisplayText(shuffleText(text, emptySet));
        setIsDecrypted(false);
    }, [text, shuffleText]);

    const triggerDecrypt = useCallback(() => {
        if (sequential) {
            orderRef.current = computeOrder(text.length);
            pointerRef.current = 0;
            const initialSet = new Set();
            setRevealedIndices(initialSet);
            setDisplayText(shuffleText(text, initialSet));
        } else {
            const initialSet = new Set();
            setRevealedIndices(initialSet);
            setDisplayText(shuffleText(text, initialSet));
        }
        setDirection('forward');
        setIsAnimating(true);
    }, [sequential, computeOrder, text.length]);

    const triggerReverse = useCallback(() => {
        if (sequential) {
            // compute forward order then reverse it: we'll remove indices in that order
            orderRef.current = computeOrder(text.length).slice().reverse();
            pointerRef.current = 0;
            const fullSet = fillAllIndices();
            setRevealedIndices(fullSet); // start fully revealed
            setDisplayText(text); // Ensure original text is visible before starting scramble
        } else {
            // non-seq: start from fully revealed as well
            const fullSet = fillAllIndices();
            setRevealedIndices(fullSet);
            setDisplayText(text);
        }
        setDirection('reverse');
        setIsAnimating(true);
    }, [sequential, computeOrder, fillAllIndices, shuffleText, text]);

    useEffect(() => {
        if (!isAnimating) return;

        let currentIteration = 0;

        const getNextIndex = revealedSet => {
            const textLength = text.length;
            switch (revealDirection) {
                case 'start':
                    return revealedSet.size;
                case 'end':
                    return textLength - 1 - revealedSet.size;
                case 'center': {
                    const middle = Math.floor(textLength / 2);
                    const offset = Math.floor(revealedSet.size / 2);
                    const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

                    if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
                        return nextIndex;
                    }
                    for (let i = 0; i < textLength; i++) {
                        if (!revealedSet.has(i)) return i;
                    }
                    return 0;
                }
                default:
                    return revealedSet.size;
            }
        };

        intervalRef.current = setInterval(() => {
            if (sequential) {
                if (direction === 'forward') {
                    if (pointerRef.current < orderRef.current.length) {
                        const nextIndex = orderRef.current[pointerRef.current++];
                        setRevealedIndices(prev => {
                            const nextSet = new Set(prev);
                            nextSet.add(nextIndex);
                            return nextSet;
                        });
                    } else {
                        clearInterval(intervalRef.current);
                        setIsAnimating(false);
                        setIsDecrypted(true);
                    }
                } else {
                    // Reverse (Re-encrypt)
                    if (pointerRef.current < orderRef.current.length) {
                        const idxToRemove = orderRef.current[pointerRef.current++];
                        setRevealedIndices(prev => {
                            const nextSet = new Set(prev);
                            nextSet.delete(idxToRemove);
                            return nextSet;
                        });
                    } else {
                        clearInterval(intervalRef.current);
                        setIsAnimating(false);
                        setIsDecrypted(false);
                    }
                }
            } else {
                // Non-Sequential
                if (direction === 'forward') {
                    currentIteration++;
                    if (currentIteration >= maxIterations) {
                        setRevealedIndices(fillAllIndices());
                        clearInterval(intervalRef.current);
                        setIsAnimating(false);
                        setIsDecrypted(true);
                    }
                } else {
                    // Non-Sequential Reverse
                    currentIteration++;
                    const removeCount = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));
                    setRevealedIndices(prev => removeRandomIndices(prev, removeCount));
                    
                    if (currentIteration >= maxIterations) {
                        setRevealedIndices(new Set());
                        clearInterval(intervalRef.current);
                        setIsAnimating(false);
                        setIsDecrypted(false);
                    }
                }
            }
        }, speed);

        return () => clearInterval(intervalRef.current);
    }, [
        isAnimating,
        text.length,
        speed,
        maxIterations,
        sequential,
        revealDirection,
        direction,
        fillAllIndices,
        removeRandomIndices
    ]);

    // Update display text whenever revealedIndices or triggers change
    useEffect(() => {
        if (isAnimating || !isDecrypted) {
            setDisplayText(shuffleText(text, revealedIndices));
        } else {
            setDisplayText(text);
        }
    }, [revealedIndices, isAnimating, isDecrypted, text, shuffleText]);

    useEffect(() => {
        if (!loop || isAnimating) return;

        const timeout = setTimeout(() => {
            if (isDecrypted) {
                triggerReverse();
            } else {
                triggerDecrypt();
            }
        }, isDecrypted ? pauseTime : 300); // Hold on word, but start decryption faster after scramble

        return () => clearTimeout(timeout);
    }, [loop, isAnimating, isDecrypted, pauseTime, triggerDecrypt, triggerReverse]);

    /* Click Behaviour */
    const handleClick = () => {
        if (animateOn !== 'click') return;

        if (clickMode === 'once') {
            if (isDecrypted) return;
            setDirection('forward');
            triggerDecrypt();
        }

        if (clickMode === 'toggle') {
            if (isDecrypted) {
                triggerReverse();
            } else {
                setDirection('forward');
                triggerDecrypt();
            }
        }
    };

    /* Hover Behaviour */
    const triggerHoverDecrypt = useCallback(() => {
        if (isAnimating) return;

        setRevealedIndices(new Set());
        setIsDecrypted(false);
        setDisplayText(text);
        setDirection('forward');
        setIsAnimating(true);
    }, [isAnimating, text]);

    const resetToPlainText = useCallback(() => {
        clearInterval(intervalRef.current);
        setIsAnimating(false);
        setRevealedIndices(new Set());
        setDisplayText(text);
        setIsDecrypted(true);
        setDirection('forward');
    }, [text]);

    useEffect(() => {
        if (animateOn !== 'view' && animateOn !== 'inViewHover') return;

        const observerCallback = entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    triggerDecrypt();
                    setHasAnimated(true);
                }
            });
        };

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const currentRef = containerRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [animateOn, hasAnimated, triggerDecrypt]);

    useEffect(() => {
        if (animateOn === 'click') {
            encryptInstantly();
        } else {
            setDisplayText(text);
            setIsDecrypted(true);
        }
        setRevealedIndices(new Set());
        setDirection('forward');
    }, [animateOn, text, encryptInstantly]);

    const animateProps =
        animateOn === 'hover' || animateOn === 'inViewHover'
            ? {
                onMouseEnter: triggerHoverDecrypt,
                onMouseLeave: resetToPlainText
            }
            : animateOn === 'click'
                ? {
                    onClick: handleClick
                }
                : {};

    return (
        <motion.span
            ref={containerRef}
            className={`inline-block whitespace-pre-wrap ${parentClassName}`}
            {...animateProps}
            {...props}
        >
            <span className="sr-only">{displayText}</span>

            <span aria-hidden="true">
                {displayText.split('').map((char, index) => {
                    const isRevealedOrDone = revealedIndices.has(index) || (!isAnimating && isDecrypted);

                    return (
                        <span key={index} className={isRevealedOrDone ? className : encryptedClassName}>
                            {char}
                        </span>
                    );
                })}
            </span>
        </motion.span>
    );
}
