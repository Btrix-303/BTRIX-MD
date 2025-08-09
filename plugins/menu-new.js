const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const menuCaption = `
╭━━━〔 *${config.BOT_NAME}* 〕━━━┈⊷
│ 👋 𝐇𝐈, 𝐈𝐌 𝐀𝐋𝐈𝐕𝐄 𝐍𝐎𝐖
│
┃★╭──────────────
│★ |📌 *𝙾𝚆𝙽𝙴𝚁*  : ${config.OWNER_NAME}
│★ |🌐 *𝙼𝙾𝙳𝙴*   : [${config.MODE}]
│★ |✨ *𝙿𝚁𝙴𝙵𝙸𝚇* : [${config.PREFIX}]
│★ |📌 *𝚅𝙴𝚁𝚂𝙸𝙾𝙽* : ${config.version}
│  ╰─────────────✦
╰━━━━━━━━━━━━━━━┈⊷
📋 *ᴄʜᴏᴏsᴇ ᴀ ᴄᴀᴛᴇɢᴏʀʏ ᴛᴏ ᴇxᴘʟᴏʀᴇ:*

 ➦✧ -〘 *ʙᴏᴛ ᴍᴇɴᴜ* 〙 -  ✧━┈⊷
┃✧ ➦♦⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆✧━┈⊷
┃✧│  ❶  *ᴅᴏᴡɴʟᴏᴅᴇᴅ ᴍᴇɴᴜ*
┃✧│  ❷ *ɢʀᴏᴜᴘ ᴍᴇɴᴜ*
┃✧│  ❸ *ғᴜɴ ᴍᴇɴᴜ*
┃✧│  ❹  *ᴏᴡɴᴇʀ ᴍᴇɴᴜ*
┃✧│  ❺  *ᴀɪ ᴍᴇɴᴜ*
┃✧│  ❻  *ᴀɴɪᴍᴇ ᴍᴇɴᴜ*
┃✧│  ❼  *ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ*
┃✧│  ❽  *ᴏᴛʜᴇʀ ᴍᴇɴᴜ*
┃✧│  ❾  *ʀᴇᴀᴄʏ ᴍᴇɴᴜ*
┃✧│  ❿  *ᴍᴀɪɴ ᴍᴇɴᴜ*
┃✧ ➥ ⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆✧━┈⊷
 ➥⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆✧━┈⊷
> ${config.DESCRIPTION}`;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '@newsletter',
                newsletterName: config.OWNER_NAME,
                serverMessageId: 143
            }
        };

        // Function to send menu image with timeout
        const sendMenuImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/yj7zp0.png' },
                        caption: menuCaption,
                        contextInfo: contextInfo
                    },
                    { quoted: mek }
                );
            } catch (e) {
                console.log('Image send failed, falling back to text');
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        };
        // Function to send menu audio with timeout
        const sendMenuAudio = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay after image
                await conn.sendMessage(from, {
                    audio: { url: 'https://files.catbox.moe/wzodz1.mp3' },
                    mimetype: 'audio/mp4',
                    ptt: true,
                }, { quoted: mek });
            } catch (e) {
                console.log('Audio send failed, continuing without it');
            }
        };
        
        // Send image first, then audio sequentially
        let sentMsg;
        try {
            // Send image with 10s timeout
            sentMsg = await Promise.race([
                sendMenuImage(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
            ]);
            
            // Then send audio with 1s delay and 8s timeout
            await Promise.race([
                sendMenuAudio(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Audio send timeout')), 8000))
            ]);
        } catch (e) {
            console.log('Menu send error:', e);
            if (!sentMsg) {
                sentMsg = await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        }
        
        const messageID = sentMsg.key.id;

        // Menu data (complete version)
        const menuData = {
            '1': {
                title: "📥 *Download Menu* 📥",
                content: `╭━━━〔 *Download Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🌐 *Social Media*
┃★│ • 𝔽ᴀᴄᴇʙᴏᴏᴋ 
┃★│ • 𝕄ᴇᴅɪᴀꜰɪʀᴇ 
┃★│ • 𝕋ɪᴋᴛᴏᴋ 
┃★│ • 𝕋ᴡɪᴛᴛᴇʀ 
┃★│ • 𝕀ɴꜱᴛᴀɢʀᴀᴍ
┃★│ • 𝔸ᴘᴋ
┃★│ • 𝕀ᴍɢ
┃★│ • 𝕋ᴛ2
┃★│ • ℙɪɴꜱ
┃★│ • 𝔸ᴘᴋ2
┃★│ • 𝔽ʙ2
┃★│ • ℙɪɴᴛᴇʀᴇꜱᴛ
┃★╰──────────────
┃★╭──────────────
┃★│ 🎵 *Music/Video*
┃★│ • 𝕊ᴘᴏᴛɪꜰʏ 
┃★│ • ℙʟᴀʏ 
┃★│ • ℙʟᴀʏ2-10
┃★│ • 𝔸ᴜᴅɪᴏ 
┃★│ • 𝕍ɪᴅᴇᴏ 
┃★│ • 𝕍ɪᴅᴇᴏᴅᴏᴄ
┃★│ • 𝕐ᴛᴍᴘ3 
┃★│ • 𝕐ᴛᴍᴘ4
┃★│ • 𝕊ᴏɴɢ 
┃★│ • 𝔻ʀᴀᴍᴀ 
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '2': {
                title: "👥 *Group Menu* 👥",
                content: `╭━━━〔 *Group Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🛠️ *Management*
┃★│ • 𝔾ʀᴏᴜᴘʟɪɴᴋ
┃★│ • 𝕂ɪᴄᴋᴀʟʟ
┃★│ • 𝕂ɪᴄᴋᴀʟʟ2
┃★│ • 𝕂ɪᴄᴋᴀʟʟ3
┃★│ • 𝔸ᴅᴅ
┃★│ • ℝᴇᴍᴏᴠᴇ
┃★│ • 𝕂ɪᴄᴋ
┃★╰──────────────
┃★╭──────────────
┃★│ ⚡ *Admin Tools*
┃★│ • ℙʀᴏᴍᴏᴛᴇ
┃★│ • 𝔻ᴇᴍᴏᴛᴇ
┃★│ • 𝔻ɪꜱᴍɪꜱꜱ 
┃★│ • ℝᴇᴠᴏᴋᴇ
┃★│ • 𝕄ᴜᴛᴇ
┃★│ • 𝕌ɴᴍᴜᴛᴇ
┃★│ • 𝕃ᴏᴄᴋɢᴄ
┃★│ • 𝕌ɴʟᴏᴄᴋɢᴄ
┃★╰──────────────
┃★╭──────────────
┃★│ 🏷️ *Tagging*
┃★│ • 𝕋ᴀɢ
┃★│ • ℍɪᴅᴇᴛᴀɢ
┃★│ • 𝕋ᴀɢᴀʟʟ
┃★│ • 𝕋ᴀɢᴀᴅᴍɪɴꜱ
┃★│ • 𝕀ɴᴠɪᴛᴇ
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '3': {
                title: "😄 *Fun Menu* 😄",
                content: `╭━━━〔 *Fun Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🎭 *Interactive*
┃★│ • 𝕊ʜᴀᴘᴀʀ
┃★│ • ℝᴀᴛᴇ
┃★│ • 𝕀ɴꜱᴜʟᴛ
┃★│ • ℍᴀᴄᴋ
┃★│ • 𝕊ʜɪᴘ
┃★│ • ℂʜᴀʀᴀᴄᴛᴇʀ
┃★│ • ℙɪᴄᴋᴜᴘ
┃★│ • 𝕁ᴏᴋᴇ
┃★╰──────────────
┃★╭──────────────
┃★│ 😂 *Reactions*
┃★│ • ℍʀᴛ
┃★│ • ℍᴘʏ
┃★│ • 𝕊ʏᴅ
┃★│ • 𝔸ɴɢᴇʀ
┃★│ • 𝕊ʜʏ
┃★│ • 𝕂ɪꜱꜱ
┃★│ • 𝕄ᴏɴ
┃★│ • ℂᴜɴꜰᴜᴢᴇᴅ
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '4': {
                title: "👑 *Owner Menu* 👑",
                content: `╭━━━〔 *Owner Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ ⚠️ *Restricted*
┃★│ • 𝔹ʟᴏᴄᴋ
┃★│ • 𝕌ɴʙʟᴏᴄᴋ
┃★│ • 𝔽ᴜʟʟᴘᴘ
┃★│ • 𝕊ᴇᴛᴘᴘ
┃★│ • ℝᴇꜱᴛᴀʀᴛ
┃★│ • 𝕊ʜᴜᴛᴅᴏᴡɴ
┃★│ • 𝕌ᴘᴅᴀᴛᴇᴄᴍᴅ
┃★╰───────────���──
┃★╭──────────────
┃★│ ℹ️ *Info Tools*
┃★│ • 𝔾ᴊɪᴅ
┃★│ • 𝕁ɪᴅ
┃★│ • 𝕃ɪꜱᴛᴄᴍᴅ
┃★│ • 𝔸ʟʟᴍᴇɴᴜ
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '5': {
                title: "🤖 *AI Menu* 🤖",
                content: `╭━━━〔 *AI Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 💬 *Chat AI*
┃★│ • 𝔸ɪ
┃★│ • 𝔾ᴘᴛ3
┃★│ • 𝔾ᴘᴛ2
┃★│ • ℂʜᴀᴛɢᴘᴛᴍɪɴɪ
┃★│ • 𝔾ᴘᴛ
┃★│ • 𝕄ᴇᴛᴀ
┃★╰──────────────
┃★╭──────────────
┃★│ 🖼️ *Image AI*
┃★│ • 𝕀ᴍᴀɢɪɴᴇ
┃★│ • 𝕀ᴍᴀɢɪɴᴇ2
┃★╰──────────────
┃★╭──────────────
┃★│ 🔍 *Specialized*
┃★│ • 𝔹ʟᴀᴄᴋʙᴏx
┃★│ • 𝕃ᴜᴍᴀ
┃★│ • 𝔻ᴊ
┃★│ • 𝕂ʜᴀɴ
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '6': {
                title: "🎎 *Anime Menu* 🎎",
                content: `╭━━━〔 *Anime Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🖼️ *Images*
┃★│ • 𝔽ᴀᴄᴋ
┃★│ • 𝔻ᴏɢ
┃★│ • 𝔸ᴡᴏᴏ
┃★│ • 𝔾ᴀʀʟ
┃★│ • 𝕎ᴀɪꜰᴜ
┃★│ • ℕᴇᴋᴏ
┃★│ • 𝕄ᴇɢɴᴜᴍɪɴ
┃★│ • 𝕄ᴀɪᴅ
┃★│ • 𝕃ᴏʟɪ
┃★╰──────────────
┃★╭──────────────
┃★│ 🎭 *Characters*
┃★│ • 𝔸ɴɪᴍᴇɢɪʀʟ
┃★│ • 𝔸ɴɪᴍᴇɢɪʀʟ1-5
┃★│ • 𝔸ɴɪᴍᴇ1-5
┃★│ • 𝔽ᴏxɢɪʀʟ
┃★│ • ℕᴀʀᴜᴛᴏ
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '7': {
                title: "🔄 *Convert Menu* 🔄",
                content: `╭━━━〔 *Convert Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🖼️ *Media*
┃★│ • 𝕊ᴛɪᴄᴋᴇʀ
┃★│ • 𝕊ᴛɪᴄᴋᴇʀ2
┃★│ • 𝔼ᴍᴏᴊɪᴍɪx
┃★│ • 𝕋ᴀᴋᴇ
┃★│ • 𝕋ᴏᴍᴘ3
┃★╰──────────────
┃★╭──────────────
┃★│ 📝 *Text*
┃★│ • 𝔽ᴀɴᴄʏ
┃★│ • 𝕋ᴛꜱ
┃★│ • 𝕋ʀᴛ
┃★│ • 𝔹ᴀꜱᴇ64
┃★│ • 𝕌ɴʙᴀꜱᴇ64
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '8': {
                title: "📌 *Other Menu* 📌",
                content: `╭━━━〔 *Other Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🕒 *Utilities*
┃★│ • 𝕋ɪᴍᴇɴᴏᴡ
┃★│ • 𝔻ᴀᴛᴇ
┃★│ • ℂᴏᴜɴᴛ
┃★│ • ℂᴀʟᴄᴜʟᴀᴛᴇ
┃★│ • ℂᴏᴜɴᴛx
┃★╰──────────────
┃★╭──────────────
┃★│ 🎲 *Random*
┃★│ • 𝔽ʟɪᴘ
┃★│ • ℂᴏɪɴꜰʟɪᴘ
┃★│ • ℝᴄᴏʟᴏʀ
┃★│ • ℝᴏʟʟ
┃★│ • 𝔽ᴀᴄᴛ
┃★╰──────────────
┃★╭──────────────
┃★│ 🔍 *Search*
┃★│ • 𝔻ᴇꜰɪɴᴇ
┃★│ • ℕᴇᴡꜱ
┃★│ • 𝕄ᴏᴠɪᴇ
┃★│ • 𝕎ᴇᴀᴛʜᴇʀ
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '9': {
                title: "💞 *Reactions Menu* 💞",
                content: `╭━━━〔 *Reactions Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ ❤️ *Affection*
┃★│ • ℂᴜᴅᴅʟᴇ
┃★│ • ℍᴜɢ
┃★│ • 𝕂ɪꜱꜱ
┃★│ • 𝕃ɪᴄᴋ
┃★│ • ℙᴀᴛ
┃★╰──────────────
┃★╭──────────────
┃★│ 😂 *Funny*
┃★│ • 𝔹ᴜʟʟʏ
┃★│ • 𝔹ᴏɴᴋ
┃★│ • 𝕐ᴇᴇᴛ
┃★│ • 𝕊ʟᴀᴘ
┃★│ • 𝕂ɪʟʟ
┃★╰──────────────
┃★╭──────────────
┃★│ 😊 *Expressions*
┃★│ • 𝔹ʟᴜꜱʜ
┃★│ • 𝕊ᴍɪʟᴇ
┃★│ • ℍᴀᴘᴘʏ
┃★│ • 𝕎ɪɴɢ
┃★│ • ℙᴏᴋᴇ
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '10': {
                title: "🏠 *Main Menu* 🏠",
                content: `╭━━━〔 *Main Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ ℹ️ *Bot Info*
┃★│ • ℙɪɴɢ
┃★│ • 𝕃ɪᴠᴇ
┃★│ • 𝔸ʟɪᴠᴇ
┃★│ • ℝᴜɴᴛɪᴍᴇ
┃★│ • 𝕌ᴘᴛɪᴍᴇ
┃★│ • ℝᴇᴘᴏ
┃★│ • 𝕆ᴡɴᴇʀ
┃★╰──────────────
┃★╭──────────────
┃★│ 🛠️ *Controls*
┃★│ • 𝕄ᴇɴᴜ
┃★│ • 𝕄ᴇɴᴜ2
┃★│ • ℝᴇꜱᴛᴀʀᴛ
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            }
        };

        // Message handler with improved error handling
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                
                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation || 
                                      receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;

                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];
                        
                        try {
                            if (selectedMenu.image) {
                                await conn.sendMessage(
                                    senderID,
                                    {
                                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/yj7zp0.png' },
                                        caption: selectedMenu.content,
                                        contextInfo: contextInfo
                                    },
                                    { quoted: receivedMsg }
                                );
                            } else {
                                await conn.sendMessage(
                                    senderID,
                                    { text: selectedMenu.content, contextInfo: contextInfo },
                                    { quoted: receivedMsg }
                                );
                            }

                            await conn.sendMessage(senderID, {
                                react: { text: '✅', key: receivedMsg.key }
                            });

                        } catch (e) {
                            console.log('Menu reply error:', e);
                            await conn.sendMessage(
                                senderID,
                                { text: selectedMenu.content, contextInfo: contextInfo },
                                { quoted: receivedMsg }
                            );
                        }

                    } else {
                        await conn.sendMessage(
                            senderID,
                            {
                                text: `❌ *Invalid Option!* ❌\n\nPlease reply with a number between 1-10 to select a menu.\n\n*Example:* Reply with "1" for Download Menu\n\n> ${config.DESCRIPTION}`,
                                contextInfo: contextInfo
                            },
                            { quoted: receivedMsg }
                        );
                    }
                }
            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        // Add listener
        conn.ev.on("messages.upsert", handler);

        // Remove listener after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        try {
            await conn.sendMessage(
                from,
                { text: `❌ Menu system is currently busy. Please try again later.\n\n> ${config.DESCRIPTION}` },
                { quoted: mek }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
    }
});
                
