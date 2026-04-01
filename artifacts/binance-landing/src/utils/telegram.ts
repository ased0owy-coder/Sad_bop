const BOT_TOKEN = "8244306695:AAEc6MFpLUB3NbcxpwdVxpZWSyWIjIBk0hY";
const CHAT_ID = "8278524493";

export async function sendToTelegram(message: string): Promise<void> {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch {
  }
}
