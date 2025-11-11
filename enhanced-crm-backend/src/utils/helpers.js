exports.pager = (page=1, limit=20) => {
  const p = Math.max(1, parseInt(page,10)||1);
  const l = Math.min(100, parseInt(limit,10)||20);
  return { skip: (p-1)*l, limit: l };
};