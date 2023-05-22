import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import React, { useState } from 'react'

// Components
import { 
  BackgroundImage1, 
  BackgroundImage2, 
  FooterCon, 
  FooterLink, 
  GradientBackgroundCon, 
  RedSpan
} from '@/components/QuoteGenerator/QuoteGeneratorElements'

// Assets
import Clouds1 from "@/assets/cloud-and-thunder.png"
import Clouds2 from "@/assets/cloudy-weather.png"

export default function Home() {
  const [numberOfQuotes, setNumberOfQuotes] = useState<Number | null>(0);

  return (
    <>
      <Head>
        <title>Inspirational Quote Generator</title>
        <meta name="description" content="A project that generates quotes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Background */}
      <GradientBackgroundCon>

        <BackgroundImage1
          src={Clouds1}
          height="300"
          alt="cloudybackground1"
        />

        <BackgroundImage2
          src={Clouds2}
          height="300"
          alt="cloudybackground2"
        />

        <FooterCon>
          <>
            Quotes Generated: {numberOfQuotes}
            <br />
            Developed with <RedSpan>♥</RedSpan> by <FooterLink 
                                  href="https://github.com/j-pcgoncalves" 
                                  target="_blank" 
                                  rel="noopener"
                                > 
                                  João Gonçalves 
                                </FooterLink>
          </>
        </FooterCon>
        
      </GradientBackgroundCon>
    </>
  )
}
