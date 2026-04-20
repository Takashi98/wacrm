const Workspace = require('./workspace.model')

function serializeWorkspace(workspace) {
  return {
    id: workspace.id,
    name: workspace.name,
    createdAt: workspace.createdAt,
  }
}

async function createWorkspace(input) {
  return Workspace.create({
    name: input.name,
  })
}

module.exports = {
  createWorkspace,
  serializeWorkspace,
}
