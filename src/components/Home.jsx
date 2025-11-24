import React from 'react';
import Hero from './Hero.jsx';
import Grid from './Grid.jsx';
import ContactCTA from './ContactCTA.jsx';
import Whats from './Whats.jsx';
import Featured from './Featured.jsx';


export default function Home(){
  return (
    <main>
      <Hero />
      <section className="max-w-6xl mx-auto p-6">
        <Featured />
        <Grid />
      </section>
      <ContactCTA />
      <Whats />
    </main>
  );
}
