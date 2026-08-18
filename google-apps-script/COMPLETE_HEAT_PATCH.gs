// Add this route inside doPost(e), immediately after the saveHeat route:
// if(request.action==='completeHeat'){ requireSupervisor_(user); completeHeat_(request.heatId); return json_({ok:true}); }

function completeHeat_(heatId){
  const id=String(heatId||'').trim();
  if(!id) throw new Error('Heat ID is required.');
  const sheet=SpreadsheetApp.getActive().getSheetByName(SHEETS.HEATS);
  if(!sheet||sheet.getLastRow()<2) throw new Error('Heat was not found.');
  const ids=sheet.getRange(2,1,sheet.getLastRow()-1,1).getDisplayValues();
  const index=ids.findIndex(r=>String(r[0]).trim()===id);
  if(index<0) throw new Error('Heat was not found. Sync and try again.');
  const row=index+2,lock=LockService.getDocumentLock(); lock.waitLock(10000);
  try{ sheet.getRange(row,6).setValue('Correction completed'); }
  finally{ lock.releaseLock(); }
}
