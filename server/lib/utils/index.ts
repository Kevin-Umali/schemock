/**
 * This file is deprecated and will be removed in a future version.
 * Please import utilities directly from their respective modules:
 * - IP utilities: import from '../../utils/ip'
 * - SQL utilities: import from '../../utils/sql'
 * - Sort utilities: import from '../../utils/sort'
 */

import { generateSingleRowInsertStatements, generateMultiRowInsertStatement } from '../../utils/sql'
import { isIp, extractClientIpFromHeaders, extractClientIp } from '../../utils/ip'
import { sortNestedData } from '../../utils/sort'

// Re-export for backward compatibility
export { generateSingleRowInsertStatements, generateMultiRowInsertStatement, isIp, extractClientIpFromHeaders, extractClientIp, sortNestedData }
