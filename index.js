// Trigger Railway Deployment
// MARKET DOJO DISCORD BOT — FINAL STRUCTURE WITH EMOJIS & FORUMS

require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField, Partials, ChannelType } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.GuildMember, Partials.User]
});

let newbieRole, studentRole;

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const guild = client.guilds.cache.first();
  if (!guild) return console.log('Bot is not in any server.');

  // 🧨 RESET SERVER STRUCTURE
  for (const channel of guild.channels.cache.values()) {
    try { await channel.delete(); } catch {}
  }
  const rolesToDelete = ['🐣 Newbie', '📘 Student'];
  for (const role of guild.roles.cache.values()) {
    if (rolesToDelete.includes(role.name)) {
      try { await role.delete(); } catch {}
    }
  }

  // ✅ CREATE ROLES
  newbieRole = await guild.roles.create({ name: '🐣 Newbie', color: 'Grey' });
  studentRole = await guild.roles.create({ name: '📘 Student', color: 'Green' });

  // -------------------------- PUBLIC AREA --------------------------
  const generalInfo = await guild.channels.create({
    name: '📢｜GENERAL INFO',
    type: ChannelType.GuildCategory,
    permissionOverwrites: [
      { id: guild.roles.everyone, allow: [PermissionsBitField.Flags.ViewChannel] },
      { id: studentRole.id, allow: [PermissionsBitField.Flags.ViewChannel] }
    ]
  });

  const generalCommunity = await guild.channels.create({
    name: '💬｜COMMUNITY',
    type: ChannelType.GuildCategory,
    permissionOverwrites: [
      { id: guild.roles.everyone, allow: [PermissionsBitField.Flags.ViewChannel] },
      { id: studentRole.id, allow: [PermissionsBitField.Flags.ViewChannel] }
    ]
  });

  const generalVoice = await guild.channels.create({
    name: '🔊｜GENERAL VC',
    type: ChannelType.GuildCategory,
    permissionOverwrites: [
      { id: guild.roles.everyone, allow: [PermissionsBitField.Flags.ViewChannel] },
      { id: studentRole.id, allow: [PermissionsBitField.Flags.ViewChannel] }
    ]
  });

  const generalText = [
    ['📜｜welcome', generalInfo, ChannelType.GuildText],
    ['📌｜rules', generalInfo, ChannelType.GuildText],
    ['📣｜announcements', generalInfo, ChannelType.GuildText],
    ['💬｜general-chat', generalCommunity, ChannelType.GuildText],
    ['📊｜market-analysis', generalCommunity, ChannelType.GuildText],
    ['🌟｜testimonials', generalCommunity, ChannelType.GuildText],
    ['🔊｜General VC', generalVoice, ChannelType.GuildVoice],
    ['🎙｜Public Stage', generalVoice, ChannelType.GuildStageVoice]
  ];

  for (const [name, parent, type] of generalText) {
    await guild.channels.create({ name, type, parent: parent.id });
  }

  // -------------------------- STUDENT AREA --------------------------
  const studentInfo = await guild.channels.create({
    name: '📢｜STUDENT HUB',
    type: ChannelType.GuildCategory,
    permissionOverwrites: [
      { id: studentRole.id, allow: [PermissionsBitField.Flags.ViewChannel] },
      { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] }
    ]
  });

  const studentChat = await guild.channels.create({
    name: '💬｜STUDENT DISCUSSION',
    type: ChannelType.GuildCategory,
    permissionOverwrites: [
      { id: studentRole.id, allow: [PermissionsBitField.Flags.ViewChannel] },
      { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] }
    ]
  });

  const studentLearn = await guild.channels.create({
    name: '📚｜STUDENT LEARNING',
    type: ChannelType.GuildCategory,
    permissionOverwrites: [
      { id: studentRole.id, allow: [PermissionsBitField.Flags.ViewChannel] },
      { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] }
    ]
  });

  const studentVoice = await guild.channels.create({
    name: '🔊｜STUDENT VC',
    type: ChannelType.GuildCategory,
    permissionOverwrites: [
      { id: studentRole.id, allow: [PermissionsBitField.Flags.ViewChannel] },
      { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] }
    ]
  });

  const studentText = [
    ['📜｜student-welcome', studentInfo, ChannelType.GuildText],
    ['📣｜student-announcements', studentInfo, ChannelType.GuildText],
    ['💬｜student-general', studentChat, ChannelType.GuildText],
    ['🧠｜premium-tips', studentChat, ChannelType.GuildText],
    ['📁｜student-resources', studentLearn, ChannelType.GuildForum],
    ['🎞️｜live-recordings', studentLearn, ChannelType.GuildForum],
    ['📈｜vip-analysis', studentLearn, ChannelType.GuildText],
    ['🔊｜Student VC', studentVoice, ChannelType.GuildVoice],
    ['🎙｜Student Stage', studentVoice, ChannelType.GuildStageVoice]
  ];

  for (const [name, parent, type] of studentText) {
    await guild.channels.create({ name, type, parent: parent.id });
  }

  console.log('✅ Server layout created.');
});

client.on('guildMemberAdd', async member => {
  try {
    await member.roles.add(newbieRole);
    const welcomeChannel = member.guild.channels.cache.find(
      ch => ch.name.includes('welcome') && ch.type === ChannelType.GuildText
    );
    if (welcomeChannel) {
      welcomeChannel.send(`👋 Welcome <@${member.id}> to **Market Dojo**! You’ve been granted the 🐣 Newbie role.`);
    }
  } catch (err) {
    console.error('Failed to assign role or send welcome message:', err);
  }
});

client.on('stageInstanceCreate', async stage => {
  const name = stage.channel.name;
  const announceChannel = stage.guild.channels.cache.find(ch =>
    (name.includes('Public Stage') && ch.name.includes('announcements')) ||
    (name.includes('Student Stage') && ch.name.includes('student-announcements'))
  );
  if (announceChannel) {
    announceChannel.send(`🎤 A new stage has started in ${stage.channel} — go join in now!`);
  }
});

client.login(process.env.TOKEN);
