import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState } from 'react'
import { API } from 'aws-amplify'
import { GraphQLResult } from '@aws-amplify/api-graphql'
import { quoteQueryName } from '@/src/graphql/queries'

// Components
import { 
  BackgroundImage1, 
  BackgroundImage2, 
  FooterCon, 
  FooterLink, 
  GenerateQuoteButton, 
  GenerateQuoteButtonText, 
  GradientBackgroundCon, 
  QuoteGeneratorCon, 
  QuoteGeneratorInnerCon, 
  QuoteGeneratorSubTitle, 
  QuoteGeneratorTitle, 
  RedSpan
} from '@/components/QuoteGenerator/QuoteGeneratorElements'
import QuoteGeneratorModal from "@/components/QuoteGenerator"

// Assets
import Clouds1 from "@/assets/cloud-and-thunder.png"
import Clouds2 from "@/assets/cloudy-weather.png"


// Interface for our DynamoDB object
interface UpdateQuoteInfoData {
  id: string;
  queryName: string;
  quotesGenerated: number;
  createdAt: string;
  updatedAt: string;
}

// Type guard for our fetch function
function isGraphQLResultForquoteQueryName(response: any): response is GraphQLResult<{
  quoteQueryName: {
    items: [UpdateQuoteInfoData];
  };
}> {
  return response.data && response.data.quoteQueryName && response.data.quoteQueryName.items;
}

export default function Home() {
  const [numberOfQuotes, setNumberOfQuotes] = useState<Number | null>(0);
  const [openGenerator, setOpenGenerator] = useState(false);
  const [processingQuote, setProcessingQuote] = useState(false);
  const [quoteReceived, setQuoteReceived] = useState<String | null>(null);

  // Function to fetch our DynamoDB object (quotes generated)
  const updateQuoteInfo = async () => {
    try {
      const response = await API.graphql<UpdateQuoteInfoData>({
        query: quoteQueryName,
        authMode: "AWS_IAM",
        variables: {
          queryName: "LIVE",
        },
      })

      // Create type guard
      if (!isGraphQLResultForquoteQueryName(response)) {
        throw new Error("Unexpected response from API.graphql");
      }

      if (!response.data) {
        throw new Error("Response data is undefined");
      }

      const receivedNumberOfQuotes = response.data.quoteQueryName.items[0].quotesGenerated;
      setNumberOfQuotes(receivedNumberOfQuotes);

    } catch (error) {
      console.log("error getting quote data", error);
    }
  }

  useEffect(() => {
    updateQuoteInfo();
  }, [])

  // Functions for quote generator modal
  const handleCloseGenerator = () => {
    setOpenGenerator(false);
  }

  const handleOpenGenerator = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setOpenGenerator(true);
    setProcessingQuote(true);
    try {
      // Run Lambda function
      // setProcessingQuote(false);
      setTimeout(() => {
        setProcessingQuote(false);
      }, 3000);
    } catch (error) {
      console.log("error generating quote: ", error);
      setProcessingQuote(false);
    }
  }

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

        <QuoteGeneratorModal
          open={openGenerator}
          close={handleCloseGenerator}
          processingQuote={processingQuote}
          setProcessingQuote={setProcessingQuote}
          quoteReceived={quoteReceived}
          setQuoteReceived={setQuoteReceived}
        />

        {/* Quote Generator */}
        <QuoteGeneratorCon>
          <QuoteGeneratorInnerCon>
            <QuoteGeneratorTitle>
              Daily Inspiration Generator
            </QuoteGeneratorTitle>

            <QuoteGeneratorSubTitle>
              Looking for a splash of inspiration? Generate a quote card with a random inspirational quote provided by <FooterLink href="https://zenquotes.io/" target="_blank" rel="noopeneer noreferrer"> ZenQuotes API </FooterLink>.
            </QuoteGeneratorSubTitle>

            <GenerateQuoteButton onClick={handleOpenGenerator}>
              <GenerateQuoteButtonText>
                Make a Quote
              </GenerateQuoteButtonText>
            </GenerateQuoteButton>
          </QuoteGeneratorInnerCon>
        </QuoteGeneratorCon>

        {/* Background Images */}
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

        {/* Footer */}
        <FooterCon>
          <>
            Quotes Generated: {numberOfQuotes}
            <br />
            Developed with <RedSpan>♥</RedSpan> by <FooterLink href="https://github.com/j-pcgoncalves" target="_blank" rel="noopener noreferrer"> João Gonçalves </FooterLink>
          </>
        </FooterCon>
        
      </GradientBackgroundCon>
    </>
  )
}
