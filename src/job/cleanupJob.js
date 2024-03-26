const cron = require("node-cron");
const { File } = require("../database/models");
const { Op } = require("sequelize");
const { PREIOD_OF_INACTIVITY } = require("../config");
const { periodInMillis, thresholdDate } = require("../utils/helper");
const { deleteFileFromStorage } = require("../services/fileService");
const { CRON_EXPRESSION, DEFAULT_CRON_EXPRESSION } = require("../config");

const cleanupJob = () => {
  cron.schedule(CRON_EXPRESSION || DEFAULT_CRON_EXPRESSION, async () => {
    try {
      // Convert days to milliseconds
      const convertedTime = periodInMillis(PREIOD_OF_INACTIVITY);
      // Calculate date based on the period of inactivity
      const calculateDate = thresholdDate(convertedTime);
      // Find records where updatedAt is less than the threshold date
      const filesToDelete = await File.findAll({
        where: {
          updatedAt: {
            [Op.lt]: calculateDate,
          },
        },
      });
      if (filesToDelete.length === 0) {
        return;
      }
      // Extract file paths
      const filePathsToDelete = filesToDelete.map((file) => file.filePath);
      // Delete files from local storage
      for (const filepath of filePathsToDelete) {
        deleteFileFromStorage(filepath);
      }
      // Delete files from database in batch
      await File.destroy({
        where: {
          updatedAt: {
            [Op.lt]: calculateDate,
          },
        },
      });
    } catch (error) {}
  });
};

module.exports = cleanupJob;
