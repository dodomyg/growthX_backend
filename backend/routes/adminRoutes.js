const express = require('express')
const { verifyToken, checkRole } = require('../middleware/verifyToken')
const {getTaggedAssignments,getSingle, acceptAssignment, rejectAssignment} = require('../controller/adminController')

const router = express.Router()

router.get('/assignments',verifyToken,checkRole,getTaggedAssignments)
router.get('/assignments/:id',verifyToken,checkRole,getSingle)
router.put('/assignments/:id/accept',verifyToken,checkRole,acceptAssignment)
router.put('/assignments/:id/reject',verifyToken,checkRole,rejectAssignment)



module.exports = router