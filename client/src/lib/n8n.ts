export async function sendToN8N(data: any) {
  const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  
  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send data to N8N');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending data to N8N:', error);
    throw error;
  }
}

// Helper function to format consultation data for N8N
export function formatConsultationData(consultation: {
  audioUrl: string;
  transcription: string;
  patientId: string;
  doctorNotes?: string;
}) {
  return {
    timestamp: new Date().toISOString(),
    ...consultation,
  };
}