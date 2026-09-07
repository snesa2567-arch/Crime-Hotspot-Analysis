const analysisService =
require("../services/analysisService");

exports.getAnalysis =
async (req, res) => {

    try {

        const filters =
            req.body.filters || [];

        const [
            summary,
            crimes,
            crimeTypes,
            crimeDomains,
            genders,
            ageGroups,
            weapons,
            timeSlots
        ] = await Promise.all([

            analysisService.getCrimeSummary(filters),

            analysisService.getCrimeAnalysis(filters),

            analysisService.getCrimeTypeCount(filters),

            analysisService.getCrimeDomainCount(filters),

            analysisService.getGenderCount(filters),

            analysisService.getAgeGroupCount(filters),

            analysisService.getWeaponCount(filters),

            analysisService.getTimeSlotCount(filters)
        ]);

        res.status(200).json({

            success: true,

            summary,

            crimes,

            crimeTypes,

            crimeDomains,

            genders,

            ageGroups,

            weapons,

            timeSlots

        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};