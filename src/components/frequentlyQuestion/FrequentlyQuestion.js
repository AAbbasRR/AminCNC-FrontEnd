import React, { useState } from 'react';

import classes from './styles/FrequentlyQuestion.module.scss';

import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


const FrequentlyQuestion = ({ question, answer }) => {
    const [accordingExpanded, setAccordingExpanded] = useState(false);

    const expandHandeler = (e, expanded) => {
        setAccordingExpanded(expanded);
    };

    return (
        <Grid item xs={12}>
            <Accordion onChange={expandHandeler} className={classes.accordingContainer}>
                <AccordionSummary
                    expandIcon={accordingExpanded ? <RemoveIcon className={classes.icon} /> : <AddIcon className={classes.icon} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography align='right' variant="subtitle1" className={`title ${classes.question}`}>
                        {question}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography align='right' variant="caption" className={`caption ${classes.answer}`}>
                        {answer}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Grid >
    );
};

export default FrequentlyQuestion