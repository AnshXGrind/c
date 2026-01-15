import { NextRequest, NextResponse } from 'next/server'

// Simple PDF text extractor that works without external dependencies
async function extractTextFromPDFBuffer(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer)
  const text: string[] = []
  
  // Convert to string for parsing
  let pdfString = ''
  for (let i = 0; i < bytes.length; i++) {
    pdfString += String.fromCharCode(bytes[i])
  }
  
  // Extract text from PDF streams
  // Look for text between BT (Begin Text) and ET (End Text) markers
  const streamRegex = /stream\s*([\s\S]*?)\s*endstream/gi
  const textRegex = /\((.*?)\)/g
  const tjRegex = /\[(.*?)\]\s*TJ/gi
  
  let match
  while ((match = streamRegex.exec(pdfString)) !== null) {
    const stream = match[1]
    
    // Try to extract text from Tj operator (simple text)
    let textMatch
    while ((textMatch = textRegex.exec(stream)) !== null) {
      const extracted = textMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\\/g, '\\')
      if (extracted.trim()) {
        text.push(extracted)
      }
    }
    
    // Try to extract text from TJ operator (array of text)
    textRegex.lastIndex = 0
    while ((textMatch = tjRegex.exec(stream)) !== null) {
      const content = textMatch[1]
      let innerMatch
      const innerRegex = /\((.*?)\)/g
      while ((innerMatch = innerRegex.exec(content)) !== null) {
        const extracted = innerMatch[1]
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '')
          .replace(/\\\(/g, '(')
          .replace(/\\\)/g, ')')
          .replace(/\\\\/g, '\\')
        if (extracted.trim()) {
          text.push(extracted)
        }
      }
    }
  }
  
  // Clean up extracted text
  let result = text.join(' ')
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .trim()
  
  return result
}

// Alternative: Use backend API to extract text from complex PDFs
async function extractWithBackend(buffer: ArrayBuffer): Promise<string> {
  // This would call the backend API endpoint
  // For now, fall back to basic extraction
  return extractTextFromPDFBuffer(buffer)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const fileName = file.name.toLowerCase()
    
    // Handle DOCX files
    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      const mammoth = await import('mammoth')
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      const text = result.value.trim()
      
      if (!text || text.length < 50) {
        return NextResponse.json(
          { error: 'Could not extract meaningful text from document' },
          { status: 400 }
        )
      }
      
      return NextResponse.json({ text })
    }
    
    // Handle PDF files
    if (fileName.endsWith('.pdf')) {
      const arrayBuffer = await file.arrayBuffer()
      
      // First try simple extraction
      let text = await extractTextFromPDFBuffer(arrayBuffer)
      
      // If simple extraction fails or returns too little, try dynamic import of pdf-parse
      if (!text || text.length < 100) {
        try {
          // Dynamic import to avoid build issues
          const pdfParse = (await import('pdf-parse')).default
          const buffer = Buffer.from(arrayBuffer)
          const data = await pdfParse(buffer)
          text = data.text?.trim() || ''
        } catch (pdfError) {
          console.log('pdf-parse failed, using fallback extraction')
        }
      }
      
      // If still no text, convert to base64 and try AI-assisted extraction
      if (!text || text.length < 50) {
        // Convert to base64 for AI processing
        const bytes = new Uint8Array(arrayBuffer)
        let binary = ''
        bytes.forEach(byte => binary += String.fromCharCode(byte))
        const base64 = btoa(binary)
        
        // Try to find readable text in the raw PDF
        const rawText = binary
          .replace(/[^\x20-\x7E\n\r]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        
        // Extract potential words (3+ consecutive letters)
        const words = rawText.match(/[a-zA-Z]{3,}/g) || []
        if (words.length > 20) {
          text = words.join(' ')
        }
        
        // If we have API key and still no good text, try AI
        if ((!text || text.length < 100) && process.env.GROQ_API_KEY) {
          try {
            text = await extractWithAI(rawText.substring(0, 5000), process.env.GROQ_API_KEY)
          } catch (aiError) {
            console.log('AI extraction failed')
          }
        }
      }
      
      if (!text || text.length < 50) {
        return NextResponse.json(
          { 
            error: 'Could not extract text from this PDF. The file may be scanned/image-based. Please try uploading a text-based PDF or DOCX file, or copy-paste your resume text directly.',
            suggestion: 'If your resume is a scanned document, please recreate it in Word/Google Docs and save as DOCX.'
          },
          { status: 400 }
        )
      }
      
      return NextResponse.json({ text })
    }
    
    return NextResponse.json(
      { error: 'Unsupported file type. Please upload PDF or DOCX.' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Text extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to extract text from file. Please try a different file or format.' },
      { status: 500 }
    )
  }
}
