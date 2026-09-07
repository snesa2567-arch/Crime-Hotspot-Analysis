import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class CityVictimAgeMapper
extends Mapper<LongWritable, Text, Text, IntWritable> {

    private final static IntWritable one =
            new IntWritable(1);

    private Text outputKey =
            new Text();

    public void map(LongWritable key,
                    Text value,
                    Context context)
            throws IOException, InterruptedException {

        String line = value.toString();

        if(line.startsWith("Report Number"))
            return;

        String[] fields = line.split(",");

        try {

            String city =
                    fields[4].trim();

            int age =
                    Integer.parseInt(
                            fields[7].trim()
                    );

            String ageGroup;

            if(age <= 18)
                ageGroup = "0-18";

            else if(age <= 25)
                ageGroup = "19-25";

            else if(age <= 40)
                ageGroup = "26-40";

            else if(age <= 60)
                ageGroup = "41-60";

            else
                ageGroup = "60+";

            outputKey.set(
                    city + "\t" + ageGroup
            );

            context.write(
                    outputKey,
                    one
            );

        }
        catch(Exception e) {

        }
    }
}