// Study plan, 9 Nov to 10 Dec 2026.
// Line types:  @ week heading | # day header | ! day note | ~ suggested use
// Items:       Subject | minutes | text   (text "practice" and "listen" are shortcuts)
//              Recall | 10     Break | 15     Long break | 45
const PLAN_TEXT = String.raw`
@ Week 1 | Mon 9 to Sun 15 Nov | Diwali
# 2026-11-09 | Mon 9 Nov | Diwali sprint | 8 h
Biology | 40 | Topic 1 Characteristics and classification of living organisms (carried over)
ICT | 40 | Ch 1 Types and components of computer systems (carried over)
Break | 15
English Literature | 50 | Paper 4 Unseen (1/2): prose approach, annotating, writer's methods, structuring a response, then one timed unseen prose question
Break | 15
Biology | 60 | Topic 2 Organisation of the organism (carried over)
Break | 15
ICT | 60 | Ch 2 and Ch 3 Input, output devices and storage (carried over)
Long break | 45
English Literature | 50 | Paper 4 Unseen (2/2): poem approach, imagery, tone, form, personal response, then one timed unseen poem question
English Literature | 30 | practice
Break | 15
Biology | 40 | Topic 3 Movement into and out of cells: diffusion, osmosis, active transport, osmosis practical
Biology | 30 | practice
Break | 15
ICT | 50 | Ch 4 Networks and the effects of using them
ICT | 30 | practice
# 2026-11-10 | Tue 10 Nov | Diwali sprint | 7 h 30 min
Recall | 10
Hindi | 65 | स्वास्थ्य (health) (carried over)
Break | 15
Chemistry | 45 | Ch 1 States of matter: kinetic particle theory, changes of state, diffusion, heating and cooling curves
Chemistry | 30 | practice
Break | 15
Physics | 70 | Ch 1 Measurements and units (carried over)
Physics | 30 | practice
Long break | 45
Hindi | 55 | ई मेल (email): format and one practice email, using स्वास्थ्य vocabulary
Break | 15
Hindi | 80 | पर्यावरण एवं प्राणी जगत (environment and animal world) (1/2): key vocabulary, reading passage and comprehension questions
Break | 15
Hindi | 30 | practice
Hindi | 45 | listen
# 2026-11-11 | Wed 11 Nov | Diwali sprint | 7 h 25 min
Recall | 10
Biology | 55 | Topic 4 Biological molecules: carbohydrates, proteins, fats, food tests, DNA structure, water
Biology | 35 | Topic 5 Enzymes: properties, effect of temperature and pH, enzyme experiments
Break | 15
ICT | 30 | Ch 5 The effects of using IT
ICT | 50 | Ch 6 ICT applications
Break | 15
Biology | 55 | Topic 6 Plant nutrition: photosynthesis, limiting factors, leaf structure, mineral ions
ICT | 30 | Ch 7 The systems life cycle
Long break | 45
ICT | 35 | Ch 8 Safety and security
Biology | 65 | Topic 7 Human nutrition: balanced diet, alimentary canal, digestion, absorption, bile
Break | 15
Biology | 30 | practice
ICT | 30 | Ch 9 Audiences and Ch 10 Communication
ICT | 30 | practice
# 2026-11-12 | Thu 12 Nov | Diwali sprint | 7 h 25 min
Recall | 10
Biology | 50 | Topic 8 Transport in plants: root hairs, xylem, transpiration, phloem and translocation
Break | 15
ICT | 50 | Ch 11 File management and Ch 12 Images (do the tasks on a computer)
Break | 15
Biology | 70 | Topic 9 Transport in animals: circulatory system, heart, blood vessels, blood components, coronary heart disease
Break | 15
ICT | 60 | Ch 13 Layouts, Ch 14 Styles and Ch 15 Proofing (do the tasks on a computer)
ICT | 25 | Ch 16 Graphs and charts (do the tasks on a computer)
Long break | 45
Biology | 50 | Topic 10 Diseases and immunity: pathogens, transmission, body defences, vaccination, antibodies
Biology | 40 | Topic 11 Gas exchange in humans: breathing, alveoli, ventilation, effects of exercise and smoking
Break | 15
Biology | 30 | practice
ICT | 40 | Ch 17 Document production (do the tasks on a computer)
ICT | 30 | practice
# 2026-11-13 | Fri 13 Nov | Diwali sprint | 6 h 30 min
Recall | 10
Biology | 35 | Topic 12 Respiration: aerobic and anaerobic respiration, respiration experiments
Biology | 35 | Topic 13 Excretion in humans: excretory products, kidney structure and function, dialysis
Break | 15
ICT | 55 | Ch 18 Databases (do the tasks on a computer)
ICT | 30 | Ch 19 Presentations (do the tasks on a computer)
Break | 15
ICT | 30 | practice
Biology | 50 | Topic 14 Coordination and response (1/2): nervous system, reflex arc, sense organs, the eye
Long break | 45
Biology | 40 | Topic 14 Coordination and response (2/2): hormones, homeostasis, tropic responses
Biology | 40 | Topic 16 Reproduction (1/2): asexual and sexual reproduction, flowers, pollination, fertilisation, seeds and germination
Break | 15
Biology | 30 | practice
Hindi | 45 | listen
# 2026-11-14 | Sat 14 Nov | Diwali sprint | 7 h 15 min
Recall | 10
Hindi | 75 | पत्र (letter): formal and informal formats and one practice letter, using पर्यावरण vocabulary
Break | 15
ICT | 75 | Ch 20 Spreadsheets (do the tasks on a computer)
Break | 15
Biology | 45 | Topic 16 Reproduction (2/2): human reproductive systems, fertilisation, pregnancy, hormones, menstrual cycle, birth control
Biology | 45 | Topic 17.1 to 17.3: chromosomes, genes and proteins, mitosis, meiosis
Long break | 45
Biology | 30 | practice
Hindi | 55 | पर्यटन (tourism) (1/2): key vocabulary, reading passage and comprehension questions
Break | 15
Hindi | 30 | practice
ICT | 50 | Ch 21 Website authoring (do the tasks on a computer)
Break | 15
ICT | 30 | practice
# 2026-11-15 | Sun 15 Nov | Light day | 4 h 45 min
Recall | 10
English Literature | 35 | Paper 1 Prose: The Gold Watch
English Literature | 35 | Paper 1 Prose: Nick
Break | 15
Hindi | 65 | भाषण (speech): format, useful phrases and one practice speech, using पर्यटन vocabulary
English Literature | 35 | Paper 1 Prose: The Woman's Rose
Break | 15
English Literature | 30 | practice
Hindi | 55 | शिक्षा (education) (1/2): key vocabulary, reading passage and comprehension questions
Break | 15
Hindi | 30 | practice
@ Week 2 | Mon 16 to Sun 22 Nov | School days
# 2026-11-16 | Mon 16 Nov | School day | 3 h
Recall | 10
Physics | 70 | Ch 2 Forces and motion (1/3): speed, velocity, acceleration; distance-time and speed-time graphs
Break | 15
Physics | 80 | Ch 2 Forces and motion (2/3): mass, weight and g, free fall, resultant force and F = ma, friction, terminal velocity
Break | 15
Physics | 30 | practice
# 2026-11-17 | Tue 17 Nov | School day | 3 h 5 min
Recall | 10
Physics | 50 | Ch 2 Forces and motion (3/3): momentum, impulse, conservation of momentum, circular motion
Break | 15
Physics | 60 | Ch 3 Forces and pressure (1/3): moments and the principle of moments, centre of mass, stability, equilibrium
Physics | 30 | practice
Break | 15
Hindi | 45 | listen
# 2026-11-18 | Wed 18 Nov | School day | 2 h 40 min
Recall | 10
Physics | 25 | Ch 3 Forces and pressure (2/3): Hooke's law, springs, force-extension graphs
Physics | 50 | Ch 3 Forces and pressure (3/3): pressure = force / area, liquid pressure, atmospheric pressure, barometer and manometer
Break | 15
Physics | 55 | Ch 4 Forces and energy (1/2): forms of energy, transfers and conservation, work done, kinetic and gravitational potential energy
Physics | 30 | practice
# 2026-11-19 | Thu 19 Nov | School day | 3 h 20 min
Recall | 10
Physics | 55 | Ch 4 Forces and energy (2/2): power, efficiency, energy resources (fossil fuels, nuclear, solar, wind, hydro, geothermal)
Break | 15
Physics | 55 | Ch 5 Thermal effects (1/3): kinetic particle model, thermal expansion, temperature and thermometers
Break | 15
Physics | 60 | Ch 5 Thermal effects (2/3): specific heat capacity, melting and boiling, latent heat, evaporation
Physics | 30 | practice
# 2026-11-20 | Fri 20 Nov | School day | 2 h 55 min
! Exam today: English Literature P4 Unseen.
Recall | 10
Physics | 45 | Ch 5 Thermal effects (3/3): conduction, convection, radiation and their applications
Break | 15
Physics | 55 | Ch 6 Waves and sounds (1/2): wave properties, transverse and longitudinal waves, v = f x wavelength, reflection, refraction, diffraction
Physics | 45 | Ch 6 Waves and sounds (2/2): sound, speed in different media, echoes, pitch and loudness, ultrasound, calculations
Break | 15
Physics | 30 | practice
# 2026-11-21 | Sat 21 Nov | Weekend | 6 h 10 min
Recall | 10
Physics | 55 | Ch 7 Rays and waves (1/4): reflection in plane mirrors, refraction and refractive index
Break | 15
Hindi | 75 | लेख (article): format and one practice article, using शिक्षा vocabulary
Break | 15
Hindi | 30 | practice
Physics | 40 | Ch 7 Rays and waves (2/4): critical angle, total internal reflection, optical fibres, dispersion
Long break | 45
Physics | 60 | Ch 7 Rays and waves (3/4): thin lenses, ray diagrams, real and virtual images, magnification
Physics | 35 | Ch 7 Rays and waves (4/4): electromagnetic spectrum, order, properties, uses and dangers
Break | 15
Physics | 30 | practice
Hindi | 45 | listen
# 2026-11-22 | Sun 22 Nov | Light day | 1 h 55 min
Recall | 10
Physics | 40 | Ch 8 Electricity (1/5): static electricity, charging, electric fields, conductors and insulators
Physics | 45 | Ch 8 Electricity (2/5): current, potential difference, e.m.f., resistance, charge = current x time
Break | 15
Physics | 30 | practice
@ Week 3 | Mon 23 to Sun 29 Nov | Exam week begins
# 2026-11-23 | Mon 23 Nov | Study day | 5 h 55 min
Recall | 10
Hindi | 65 | तकनीक (technology) (1/2): key vocabulary, reading passage and comprehension questions
Break | 15
Physics | 40 | Ch 8 Electricity (3/5): Ohm's law, I-V graphs, LDR, thermistor, diode, variable resistor
Break | 15
Hindi | 65 | रिपोर्ट (report): format and one practice report, using तकनीक vocabulary
Long break | 45
Physics | 60 | Ch 8 Electricity (4/5): series and parallel circuits, combined resistance, potential divider
Physics | 30 | practice
Break | 15
Hindi | 65 | जीवनी (biography) (1/2): key vocabulary, reading passage and comprehension questions
Hindi | 30 | practice
# 2026-11-24 | Tue 24 Nov | Study day | 6 h
Recall | 10
English Literature | 35 | Paper 1 Prose: The Black Ball
English Literature | 35 | Paper 1 Prose: When It Happens
Break | 15
English Language | 40 | Paper 1 Reading: comprehension (question types, own-words answers, inference)
English Language | 40 | Paper 1 Reading: summary writing (selecting points, own words, concision)
Break | 15
English Language | 30 | practice
English Literature | 35 | Paper 1 Prose: The Man Who Walked on the Moon
English Literature | 35 | Paper 1 Prose: A Walk to the Jetty
Long break | 45
English Literature | 35 | Paper 1 Prose: Showing the Flag
English Literature | 30 | practice
Break | 15
Hindi | 45 | listen
# 2026-11-25 | Wed 25 Nov | School day | 2 h 20 min
! Exam today: Biology.
Recall | 10
English Literature | 35 | Paper 1 Prose: Haywards Heath
Break | 15
English Literature | 75 | Paper 1 Poetry: Song: Love Armed; A Different History; Where I Come From
Break | 15
English Literature | 30 | practice
# 2026-11-26 | Thu 26 Nov | School day | 3 h
! Exam today: ICT.
Recall | 10
English Literature | 75 | Paper 1 Poetry: Report to Wordsworth; Follower; Storyteller
Break | 15
English Literature | 75 | Paper 1 Poetry: A Married State; Sonnet 18; Chimney Sweeper
Break | 15
English Literature | 30 | practice
# 2026-11-27 | Fri 27 Nov | School day | 3 h 20 min
! Exams today: Hindi P1, Additional Maths P1.
Recall | 10
English Language | 40 | Paper 1 Reading: writer's effect (word choice, imagery, sentence structure, explaining the effect)
English Language | 25 | Papers 1 and 2: writer's attitude (tone, viewpoint, supporting evidence)
Break | 15
English Language | 30 | practice
Break | 15
English Literature | 75 | Paper 1 Poetry: Lament; Hunting Snake; Carpet Weavers
Break | 15
English Literature | 30 | practice
# 2026-11-28 | Sat 28 Nov | Weekend | 6 h
Recall | 10
English Language | 25 | Writing: journal entry (format, voice, reflective detail) plus one timed piece
English Language | 30 | Writing: newspaper report (headline, lead, quotes, structure, register) plus one timed piece
English Language | 35 | Writing: speech writing (audience, rhetorical devices, structure) plus one timed piece
Break | 15
Physics | 40 | Ch 8 Electricity (5/5): electrical energy and power, kilowatt-hours, mains safety, fuses and earthing
Physics | 35 | Ch 9 Magnets and currents (1/3): magnets, magnetic fields, electromagnets
English Language | 25 | Writing: interview (layout, register, questions and answers) plus one timed piece
Long break | 45
English Language | 35 | Writing: formal and informal letters (layout, openings and closings, register) plus one timed piece
Physics | 40 | Ch 9 Magnets and currents (2/3): force on a current-carrying wire, motor effect, d.c. motor
Break | 15
Physics | 30 | practice
English Language | 35 | Writing: formal report (headings, sections, recommendations, objective tone) plus one timed piece
English Language | 30 | practice
# 2026-11-29 | Sun 29 Nov | Weekend | 5 h 40 min
Recall | 10
Physics | 55 | Ch 9 Magnets and currents (3/3): electromagnetic induction, generator, transformers
Physics | 35 | Ch 10 Atoms and radioactivity (1/2): nuclear model of the atom, nucleon and proton numbers, isotopes
Break | 15
English Language | 45 | Paper 2 Composition: descriptive writing (sensory detail, imagery, structure) plus one timed piece
English Language | 45 | Paper 2 Composition: narrative writing (plot structure, characters, tension, ending) plus one timed piece
Long break | 45
English Language | 30 | practice
Physics | 55 | Ch 10 Atoms and radioactivity (2/2): alpha, beta and gamma radiation, half-life, uses and safety
Break | 15
Physics | 30 | practice
Hindi | 45 | listen
@ Week 4 | Mon 30 Nov to Sun 6 Dec | Chemistry and Drama
# 2026-11-30 | Mon 30 Nov | Study day | 5 h 25 min
Recall | 10
Chemistry | 55 | Ch 2 Atoms and elements: atomic structure, isotopes, electronic configuration, relative atomic mass
Break | 15
English Literature | 70 | Paper 3 Drama: A Midsummer Night's Dream Act 1 (plot, characters, themes, key quotes, language, plan one exam-style essay question)
English Literature | 30 | practice
Long break | 45
Chemistry | 45 | Ch 3 Atoms combining (1/2): ionic and metallic bonding, formation of ions, dot-and-cross diagrams for ionic compounds, structure and properties of ionic compounds and metals
Chemistry | 45 | Ch 3 Atoms combining (2/2): covalent bonding, dot-and-cross diagrams, simple molecules, giant covalent structures (diamond, graphite, silicon dioxide), properties
Break | 15
Chemistry | 50 | Ch 4 Reacting masses and chemical equations: formulae, balanced and ionic equations, state symbols, Mr
Chemistry | 30 | practice
# 2026-12-01 | Tue 1 Dec | School day | 3 h 20 min
! Exams today: English Literature P1, Additional Maths P2.
Recall | 10
Chemistry | 40 | Ch 5 Using moles (1/2): the mole, relative formula mass, mole calculations from masses, gas volumes
Chemistry | 40 | Ch 5 Using moles (2/2): concentration, limiting reactant, percentage yield and purity, empirical and molecular formulae
Break | 15
Chemistry | 30 | Ch 6 Redox reactions: oxidation and reduction, oxidation numbers, oxidising and reducing agents
Chemistry | 30 | Ch 7 Electricity and chemical change (1/2): electrolysis of molten compounds and aqueous solutions, predicting electrode products, half-equations
Chemistry | 30 | Ch 7 Electricity and chemical change (2/2): electroplating, copper refining, electrolysis in industry, inert and active electrodes
Break | 15
Chemistry | 30 | practice
# 2026-12-02 | Wed 2 Dec | School day | 2 h 35 min
! Exams today: English Language P1, Hindi P2 listening.
Recall | 10
English Literature | 85 | Paper 3 Drama: A Midsummer Night's Dream Act 2 (forest, fairies, Oberon, Titania, Puck, love potion, plan one exam-style essay question)
Break | 15
English Literature | 40 | Paper 3 Drama: A Midsummer Night's Dream Act 3 scene 1 (rehearsal, Bottom's transformation, key quotes)
English Literature | 30 | practice
# 2026-12-03 | Thu 3 Dec | School day | 3 h
! Exam today: Physics.
Recall | 10
Chemistry | 30 | Ch 8 Energy changes and reactions: exothermic and endothermic reactions, energy level diagrams, bond energies
Chemistry | 30 | practice
Break | 15
English Literature | 90 | Paper 3 Drama: A Midsummer Night's Dream Act 3 scene 2 (lovers' confusion, Puck, quarrels, key quotes), then write a 25-mark essay plan
Break | 15
English Literature | 30 | practice
# 2026-12-04 | Fri 4 Dec | School day | 2 h 40 min
! Exam today: English Language P2.
Recall | 10
Chemistry | 50 | Ch 9 The rate of reaction: factors affecting rate, collision theory, catalysts, rate graphs
Chemistry | 35 | Ch 10 Reversible reactions and equilibrium: dynamic equilibrium, effect of conditions, Haber and Contact processes
Break | 15
Chemistry | 45 | Ch 11 Acids, bases and salts (1/2): pH scale, indicators, properties of acids and bases, neutralisation, strong and weak acids
Chemistry | 30 | practice
# 2026-12-05 | Sat 5 Dec | Weekend | 4 h
Recall | 10
Chemistry | 45 | Ch 11 Acids, bases and salts (2/2): making soluble and insoluble salts, titration, types of oxide
Break | 15
Chemistry | 60 | Ch 12 The Periodic table: groups and periods, trends, Group I, Group VII, noble gases, transition elements
Break | 15
Chemistry | 50 | Ch 13 Behaviour of metals: reactivity series, reactions with water, acids and oxygen, displacement
Break | 15
Chemistry | 55 | Ch 14 Extracting and using metals: ores, extraction methods, rusting and prevention, alloys, recycling
Chemistry | 30 | practice
# 2026-12-06 | Sun 6 Dec | Weekend | 2 h 30 min
Recall | 10
Chemistry | 45 | Ch 18 Separation and purification: filtration, crystallisation, distillation, chromatography and Rf, purity
Chemistry | 35 | Ch 19 Experiments and tests in lab (1/2): apparatus, planning experiments, tests for aqueous cations and anions
Break | 15
Chemistry | 40 | Ch 19 Experiments and tests in lab (2/2): tests for gases, flame tests, identifying substances from results
Chemistry | 30 | practice
@ Free days | Mon 7 to Thu 10 Dec | No new topics
# 2026-12-07 | Mon 7 Dec | Free day | Free
! Exam: International Maths P2 and P6.
~ Maths, then 45 minutes of Chemistry recall.
# 2026-12-08 | Tue 8 Dec | Free day | Free
! Exams: International Maths P4, English Literature P3 Drama.
~ Light Drama recall of Acts 1 to 3, then Maths.
# 2026-12-09 | Wed 9 Dec | Free day | Free
! Exam: ICT Practical P3.
~ Practise the practical tasks on a computer: spreadsheet, database, document, website.
# 2026-12-10 | Thu 10 Dec | Free day | Free
! Exam: Chemistry.
~ Past-paper questions on your weakest chapters, then an early night.
`;

// Exams. "match" picks the plan items that count towards a paper's progress.
// Exams with no subject are not in the plan and only get a countdown.
const EXAMS = [
  { name: 'English Literature P4 Unseen', date: '2026-11-20', doneBy: '2026-11-17', planned: 'Mon 9 Nov', spare: 8, subject: 'English Literature', match: /^Paper 4/ },
  { name: 'Biology', date: '2026-11-25', doneBy: '2026-11-22', planned: 'Sat 14 Nov', spare: 8, subject: 'Biology' },
  { name: 'ICT', date: '2026-11-26', doneBy: '2026-11-23', planned: 'Sat 14 Nov', spare: 9, subject: 'ICT' },
  { name: 'Hindi P1', date: '2026-11-27', doneBy: '2026-11-24', planned: 'Mon 23 Nov', spare: 1, subject: 'Hindi', skip: 'listen' },
  { name: 'Additional Maths P1', date: '2026-11-27', doneBy: '2026-11-24', subject: 'Additional Maths' },
  { name: 'English Literature P1', date: '2026-12-01', doneBy: '2026-11-28', planned: 'Fri 27 Nov', spare: 1, subject: 'English Literature', match: /^Paper 1/ },
  { name: 'Additional Maths P2', date: '2026-12-01', doneBy: '2026-11-28', subject: 'Additional Maths' },
  { name: 'English Language P1', date: '2026-12-02', doneBy: '2026-11-29', planned: 'Sat 28 Nov', spare: 1, subject: 'English Language', match: /^(Paper 1|Papers 1 and 2|Writing)/ },
  { name: 'Hindi P2 listening', date: '2026-12-02', doneBy: '2026-11-29', planned: 'Sun 29 Nov', spare: 0, subject: 'Hindi', only: 'listen' },
  { name: 'Physics', date: '2026-12-03', doneBy: '2026-11-30', planned: 'Sun 29 Nov', spare: 1, subject: 'Physics' },
  { name: 'English Language P2', date: '2026-12-04', doneBy: '2026-12-01', planned: 'Sun 29 Nov', spare: 2, subject: 'English Language', match: /^(Paper 2|Papers 1 and 2)/ },
  { name: 'International Maths P2 and P6', date: '2026-12-07', doneBy: '2026-12-04', subject: 'International Maths' },
  { name: 'International Maths P4', date: '2026-12-08', doneBy: '2026-12-05', subject: 'International Maths' },
  { name: 'English Literature P3 Drama', date: '2026-12-08', doneBy: '2026-12-05', planned: 'Thu 3 Dec', spare: 2, subject: 'English Literature', match: /^Paper 3/ },
  { name: 'ICT Practical P3', date: '2026-12-09' },
  { name: 'Chemistry', date: '2026-12-10', doneBy: '2026-12-07', planned: 'Sun 6 Dec', spare: 1, subject: 'Chemistry' }
];

const RULES = [
  'Start each day after the first with 10 minutes of recall: write what you remember of yesterday, no notes.',
  'Work in blocks of at most 90 minutes, then take the break shown. The 45-minute break is for a meal and a walk. Keep your phone out of reach.',
  'After a subject\'s last topic of the day, do its 30-minute practice slot using the five questions at the end of that day\'s notes.',
  'Hindi Paper 2 listening: use your own recordings, play each one twice as in the exam, and mark yourself afterwards.',
  'At most 3 subjects a day for topics, alternating through the day. The Hindi listening slot and the two daily Maths slots do not count towards the 3.',
  'Stop by 9 pm and protect 8 hours of sleep.',
  'If a day slips, do not double up. Move the topic to the next day with spare time, and never past its Done by date.',
  'Tick each box as you finish it. The time in each day heading counts study, practice and listening only.',
  'Anything you miss moves on by itself. Each missed item is placed on a later day, spread out so no day gets doubled up, and the whole backlog clears within 5 to 7 days. Items that are not worth doing can be dropped.'
];

const QUOTES = [
  'One block at a time. That is the whole plan.',
  'Ten minutes of recall now saves an hour of rereading later.',
  'You do not need a perfect day. You need the next tick.',
  'Tomorrow you will be glad you did this block.',
  'A slow page still moves forward.',
  'Phone in another room. Timer on. Start.',
  'Past you made this plan so present you can just follow it.',
  'The exam asks what you remember, so practise remembering.',
  'Small ticks add up to a finished syllabus.',
  'Stuck on a topic? Write down what you do know, then fill the gap.',
  'Sleep is part of the plan. Protect it.',
  'Start with the hardest block while your head is fresh.',
  'Every practice question you get wrong now is one you get right in the exam.',
  'Break time is real break time. Walk, eat, breathe.',
  'You have done harder days than this one.',
  'Finish the block in front of you. Worry about the next one later.',
  'Check the countdown, then close the tab and study.',
  'Diwali sprint now, easy school days later. The effort pays off.'
];

// Daily Maths slots: one per plan day from "from" to "to" (free days are skipped).
// On school days the slots are shorter (school minutes). Only the subject and minutes are shown. You manage the topics yourself.
const MATHS = {
  add: { name: 'Additional Maths', min: 60, school: 30, from: '2026-11-09', to: '2026-12-01' },
  intl: { name: 'International Maths', min: 30, school: 15, from: '2026-11-09', to: '2026-12-06' }
};
