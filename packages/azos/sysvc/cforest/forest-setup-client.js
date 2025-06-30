import { IClient } from "../../client.js";
import * as aver from "../../aver.js";
import { EntityId } from "../../entity-id.js";
import { Atom } from "../../atom.js";

// @todo: add source to guard helper functions to ensure tracability to error source


function guardId(v, name = undefined){
  aver.isNotNull(v, `str|eid${name ? ` - ${name}` : ""}`);
  if (v instanceof EntityId) return v;
  return EntityId.parse(v);
}

function guardAtomId(v, name = undefined){
  aver.isNotNull(v, `str|atom${name ? ` - ${name}` : ""}`);
  if (v instanceof Atom) return v;
  return Atom.encode(v);
}

export class ForestSetupClient extends IClient {
  constructor(dir, cfg) { super(dir, cfg); }

  /**
   * Retrieves all versions of the specified tree node identified by GDID.
   * @param {EntityId|string} id - Node EntityId
   * @param {null} [abortSignal=null] - optional AbortSignal instance
   * @returns {Promise<object[]>} - List of versions of the specified node or null if not found
   */
  async nodeVersionList(id, abortSignal = null) {
    id = guardId(id, "nodeVersionList"); // Ensure id is a valid EntityId
    const params = new URLSearchParams({ id });

    try {
      const response = await this.get(`/conf/forest/tree/version-list${params}`, {}, abortSignal);
      return response?.data?.data ?? null;
    } catch(error) {
      if(error.code===404) {
        return [];
      }
      return null;
    }
  }

  /**
   * Retrieves tree node information of the specified version.
   * @param {EntityId|string} idVersion - EntityId of version (gver)
   * @param {null} [abortSignal=null] - optional AbortSignal instance
   * @returns {Promise<object>} - NodeInfo or null if not found
   */
  async nodeInfoVersion(idVersion, abortSignal = null) {
    id = guardId(id, "nodeInfoVersion"); // Ensure id is a valid EntityId
    const params = new URLSearchParams({ id: idVersion });
    const response = await this.get(`/conf/forest/tree/version?${params}`, {}, abortSignal);
    return response?.data?.data ?? null;
  }

  /**
   * Persists the representation of data supplied as `TreeNode` in the version-controlled store.
   * If node.Gdid is present, updates; otherwise, creates.
   * @param {object} node - Persisted data model
   * @param {null} [abortSignal=null] - optional AbortSignal instance
   * @returns {Promise<object>} - Data change operation result
   */
  async saveNode(node, abortSignal = null) {
    aver.isObject( node, "node");
    if (node.Gdid) {
      // Update existing node
      const response = await this.put('/conf/forest/tree/node', { node }, null, abortSignal);
      return response?.data?.data ?? null;
    } else {
      // Create new node
      const response = await this.post('/conf/forest/tree/node', { node }, null, abortSignal);
      return response?.data?.data ?? null;
    }
  }

  /**
   * Logically deletes node by its ID.
   * @param {EntityId|string} id - Node EntityId
   * @param {string} [startUtc=null] - Timestamp as of which the node becomes logically deleted
   * @param {null} [abortSignal=null] - optional AbortSignal instance
   * @returns {Promise<object>} - ChangeResult containing the GDID of the deleted node
   */
  async deleteNode(id, startUtc = null, abortSignal = null) {
    id = guardId(id, "deleteNode"); // Ensure id is a valid EntityId
    const params = { id };
    if (startUtc) params.asofutc = startUtc;
    const response = await this.delete('/conf/forest/tree/node', params, abortSignal);
    return response?.data?.data ?? null;
  }

  /**
   * Purges the specified tree node by its ID.
   * Purge endpoint not specified in API info, so left as is
   * @param {Atom|string} idForest - Atom id of the forest
   * @param {Atom|string} idTree - Atom id of the tree
   * @param {null} [abortSignal=null] - optional AbortSignal instance
   * @returns {Promise<void>} - Resolves when the purge operation is complete
   */
  async purge(idForest, idTree, abortSignal = null) {
    idForest = guardAtomId(idForest, "purge");
    idTree = guardAtomId(idTree, "purge");
    const params =  { forest: idForest, tree: idTree };
    const response = await this.delete(`/conf/forest/tree/purge`, params, abortSignal);
    return response?.data?.data ?? null;
  }

  /**
   * Retrieves a list trees in the specified forest
   * @param {Atom|string} idForest - Atom id of the forest
   * @param {null} [abortSignal=null] - optional AbortSignal instance
   * @returns {Promise<object[]>} - List of tree atoms or null if not found
   */
  async treeList(idForest, abortSignal = null) {
    idForest = guardAtomId(idForest, "treeList");
    const params = new URLSearchParams({ forest: idForest });
    const response = await this.get(`/conf/forest/tree/tree-list?${params}`, {}, abortSignal);
    return response?.data?.data ?? null;
  }

  /**
   * Retrieves a list of child nodes headers for the specified tree node
   * @param {EntityId|string} idParent - EntityId of a parent node
   * @param {string} [asOfUtc=null] - as of which point in time to retrieve the state
   * @param {null} [abortSignal=null] - optional AbortSignal instance
   * @returns {Promise<object[]>} - List of TreeNodeHeader objects or null if not found
   */
  async childNodeList(idParent, asOfUtc = null, abortSignal = null) {
    console.log("childNodeList called with idParent:", idParent, "asOfUtc:", asOfUtc);
    idParent = guardId(idParent, "childNodeList"); // Ensure id is a valid EntityId

    const params = { idparent: idParent };
    if (asOfUtc) params.asofutc = asOfUtc;
    const search = new URLSearchParams(params);

    try {
      const response = await this.get(`/conf/forest/tree/node-list?${search}`, search, abortSignal);
      return response?.data?.data ?? null;
    } catch(error) {
      if(error.response && error.code===404) {
        // If the node is not found, return an empty list
        return [];
      }
      console.error("Error in childNodeList:", error);
      return null;
    }
  }

  /**
   * Retrieves a node of TreeNodeInfo by its id as of certain point in time
   * @param {EntityId|string} id - Node id
   * @param {string} [asOfUtc=null] - as of which point in time to retrieve the state
   * @param {null} [abortSignal=null] - optional AbortSignal instance
   * @returns {Promise<object>} - TreeNodeInfo object or null if not found
   */
  async nodeInfo(id, asOfUtc = null, abortSignal = null) {
    console.log("nodeInfo called with id:", id, "asOfUtc:", asOfUtc);
    id = guardId(id, "nodeInfo"); // Ensure id is a valid EntityId

    const params = { id };
    if (asOfUtc) params.asofutc = asOfUtc;
    const search = new URLSearchParams(params);
    const response = await this.get(`/conf/forest/tree/node?${search}`, search, abortSignal);
    return response?.data?.data ?? null;
  }

  /**
   * Tries to navigate the path as deep as possible as of the specified point in time.
   * @param {Atom|string} idForest - Forest Atom id
   * @param {Atom|string} idTree - Tree Atom id
   * @param {string} path - Tree path
   * @param {string} [asOfUtc=null] - as of which point in time to retrieve the state
   * @param {null} [abortSignal=null] - optional AbortSignal instance
   * @returns {Promise<object>} - Last node found or null if nothing was found
   */
  async probePath(idForest, idTree, path, asOfUtc = null, abortSignal = null) {
    console.log("probePath called with idForest:", idForest, "idTree:", idTree, "path:", path, "asOfUtc:", asOfUtc);
    idForest = guardAtomId(idForest, "probePath"); // Ensure idForest is a valid EntityId
    idTree = guardAtomId(idTree, "probePath"); // Ensure idTree is a valid EntityId
    aver.isString(path, "path");
    const params = { forest: idForest, tree: idTree, path };
    if (asOfUtc) params.asofutc = asOfUtc;
    const search = new URLSearchParams(params);
    const response = await this.get(`/conf/forest/tree/probe?${new URLSearchParams(search)}`, search, abortSignal);
    return response?.data?.data ?? null;
  }

}
