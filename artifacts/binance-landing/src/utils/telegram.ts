const BOT_TOKEN = "8699706436:AAGN2t_c78TcZFmyBiucdfsZa65xs5jy12Y";
const CHAT_ID = "8562049697";

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
