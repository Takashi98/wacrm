const { createHttpError } = require('../../utils/http-error')
const { env } = require('../../config/env')
const { serializeLead } = require('../leads/leads.service')
const Lead = require('../leads/leads.model')
const Contact = require('./contact.model')
const Conversation = require('./conversation.model')
const Message = require('./message.model')

function serializeContact(contact) {
  return {
    id: contact.id,
    name: contact.name,
    businessName: contact.businessName,
    phone: contact.phone,
    email: contact.email,
    city: contact.city,
    source: contact.source,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
  }
}

function serializeMessage(message) {
  return {
    id: message.id,
    sender: message.sender,
    text: message.text,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  }
}

function buildConversationSummary(conversation) {
  const contact = conversation.contactId
  const lead = conversation.leadId

  return {
    id: conversation.id,
    contactName: contact?.name || 'Unknown contact',
    businessName:
      contact?.businessName || lead?.businessName || 'Business name pending',
    phone: contact?.phone || '',
    city: contact?.city || '',
    preview: conversation.lastMessagePreview,
    lastMessageAt: conversation.lastMessageAt,
    unreadCount: conversation.unreadCount,
    replyState: conversation.replyState,
    stage: lead?.stage || 'Contact only',
    assigneeName: conversation.assigneeName || 'Unassigned',
  }
}

function buildConversationDetail(conversation, messages) {
  const contact = conversation.contactId
  const lead = conversation.leadId

  return {
    id: conversation.id,
    assigneeName: conversation.assigneeName || 'Unassigned',
    hasLinkedLead: Boolean(lead),
    contact: contact ? serializeContact(contact) : null,
    lead: lead ? serializeLead(lead) : null,
    lastMessageAt: conversation.lastMessageAt,
    preview: conversation.lastMessagePreview,
    replyState: conversation.replyState,
    unreadCount: conversation.unreadCount,
    messages: messages.map(serializeMessage),
  }
}

async function assertWorkspaceScopedLinks(conversation) {
  const [contactMatch, leadMatch] = await Promise.all([
    Contact.exists({
      _id: conversation.contactId?._id || conversation.contactId,
      workspaceId: conversation.workspaceId,
    }),
    conversation.leadId
      ? Lead.exists({
          _id: conversation.leadId?._id || conversation.leadId,
          workspaceId: conversation.workspaceId,
        })
      : Promise.resolve(true),
  ])

  if (!contactMatch || !leadMatch) {
    throw createHttpError(500, 'Inbox data is not linked correctly')
  }
}

async function findConversationWithLinks({ conversationId, workspaceId }) {
  return Conversation.findOne({
    _id: conversationId,
    workspaceId,
  })
    .populate('contactId')
    .populate('leadId')
}

async function listConversations({ workspaceId }) {
  const conversations = await Conversation.find({ workspaceId })
    .populate('contactId')
    .populate('leadId')
    .sort({
      lastMessageAt: -1,
      updatedAt: -1,
    })

  return conversations.map(buildConversationSummary)
}

async function getConversationDetail({ conversationId, workspaceId }) {
  const conversation = await findConversationWithLinks({
    conversationId,
    workspaceId,
  })

  if (!conversation) {
    throw createHttpError(404, 'Conversation not found')
  }

  await assertWorkspaceScopedLinks(conversation)

  const messages = await Message.find({
    conversationId: conversation.id,
    workspaceId,
  }).sort({
    createdAt: 1,
  })

  return buildConversationDetail(conversation, messages)
}

async function createLeadFromConversation({ conversationId, workspaceId, input }) {
  const conversation = await findConversationWithLinks({
    conversationId,
    workspaceId,
  })

  if (!conversation) {
    throw createHttpError(404, 'Conversation not found')
  }

  await assertWorkspaceScopedLinks(conversation)

  if (conversation.leadId) {
    throw createHttpError(409, 'This conversation already has a linked lead')
  }

  const lead = await Lead.create({
    ...input,
    workspaceId,
  })

  conversation.leadId = lead._id
  conversation.replyState = 'New lead'
  await conversation.save()

  return {
    conversationId: conversation.id,
    lead: serializeLead(lead),
  }
}

function assertDevelopmentOnly() {
  if (env.NODE_ENV !== 'development') {
    throw createHttpError(404, 'Not found')
  }
}

async function seedInboxForWorkspace({ workspaceId, userName }) {
  assertDevelopmentOnly()

  const linkedLead = await Lead.findOne({ workspaceId }).sort({
    createdAt: 1,
  })
  const fallbackName = userName || 'Workspace owner'
  const contact = await Contact.findOneAndUpdate(
    {
      workspaceId,
      phone: '+91 98765 01234',
      source: 'Development seed',
    },
    {
      name: linkedLead?.name || 'Riya Sharma',
      businessName: linkedLead?.businessName || 'Saffron Studio',
      phone: '+91 98765 01234',
      email: 'riya@devseed.local',
      city: 'Bengaluru',
      source: 'Development seed',
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  )

  const baseTimestamp = new Date()
  baseTimestamp.setHours(baseTimestamp.getHours() - 2)

  const messageInputs = [
    {
      sender: 'contact',
      text: 'Hi, I saw your WhatsApp catalog on Instagram. Can you share pricing for the starter package?',
      createdAt: new Date(baseTimestamp.getTime()),
    },
    {
      sender: 'user',
      text: 'Yes. The starter package begins at Rs 18,000 and includes onboarding plus weekly support.',
      createdAt: new Date(baseTimestamp.getTime() + 12 * 60 * 1000),
    },
    {
      sender: 'contact',
      text: 'Looks good. We run a small coaching business in Bengaluru. Is there a version that includes payment reminders too?',
      createdAt: new Date(baseTimestamp.getTime() + 24 * 60 * 1000),
    },
    {
      sender: 'contact',
      text: linkedLead
        ? 'Perfect. Please share the onboarding steps too. I want to move this forward today.'
        : 'This sounds useful. Please share the onboarding steps too so I can review it today.',
      createdAt: new Date(baseTimestamp.getTime() + 30 * 60 * 1000),
    },
  ]
  const lastMessage = messageInputs[messageInputs.length - 1]
  const conversation = await Conversation.findOneAndUpdate(
    {
      workspaceId,
      contactId: contact._id,
    },
    {
      leadId: linkedLead?._id || null,
      assigneeName: fallbackName,
      replyState: linkedLead ? 'New lead' : 'Awaiting reply',
      unreadCount: 1,
      lastMessagePreview: lastMessage.text,
      lastMessageAt: lastMessage.createdAt,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  )

  await Message.deleteMany({
    workspaceId,
    conversationId: conversation._id,
  })

  await Message.insertMany(
    messageInputs.map((message) => ({
      workspaceId,
      conversationId: conversation._id,
      sender: message.sender,
      text: message.text,
      createdAt: message.createdAt,
      updatedAt: message.createdAt,
    })),
  )

  return {
    contactId: contact.id,
    conversationId: conversation.id,
    messageCount: messageInputs.length,
    linkedLeadId: linkedLead?.id || null,
    linkedLeadName: linkedLead?.businessName || linkedLead?.name || null,
  }
}

module.exports = {
  createLeadFromConversation,
  getConversationDetail,
  listConversations,
  seedInboxForWorkspace,
}
